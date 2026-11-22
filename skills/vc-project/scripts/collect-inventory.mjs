import { readFileSync, realpathSync } from "node:fs";
import { parseArgs } from "node:util";
import { codeStandardsInventory, collectInventory, observeInventory, prepareInventory, recordKey, researchKey, sorted } from "./inventory.mjs";
import { loadSnapshot, recordOutcomes, saveSnapshot } from "./snapshot.mjs";

const onlineLimit = 5;
const priorities = {
  "published-agent-guidance": 0,
  "configuration-ownership": 1,
  "tooling-category": 2,
};

function inputs(inventory) {
  return [...inventory.packages, ...inventory.configurations];
}

function mismatchReport(inventory) {
  const mismatches = inventory.packages.filter((record) => record.installState === "installed-mismatch");
  return mismatches.length ? { mismatches } : {};
}

function groupResearch(candidates) {
  const grouped = new Map();
  for (const candidate of candidates) {
    const { researchKey: key, version, upstream, reason, inputKey, record } = candidate;
    if (!grouped.has(key)) grouped.set(key, { key, version, upstream, reason, inputs: [] });
    const group = grouped.get(key);
    if (priorities[reason] < priorities[group.reason]) group.reason = reason;
    group.upstream ??= upstream;
    group.inputs.push({ inputKey, ...record });
  }
  return sorted(grouped.values(), (entry) => priorities[entry.reason] + ":" + entry.key);
}

function scan(root, refresh) {
  const files = prepareInventory(root);
  if (!files) return { status: "not-a-js-project" };

  const state = loadSnapshot(root);
  const { snapshot } = state;
  const prepared = observeInventory(files, snapshot.inventory.configurations);
  if (!refresh && prepared.fingerprint === snapshot.fingerprint) {
    return { status: "unchanged", ...mismatchReport(snapshot.inventory) };
  }

  const local = collectInventory(root, prepared);
  const standards = codeStandardsInventory(prepared.standards, local.inventory.packages);
  const current = inputs(local.inventory);
  const currentKeys = new Set(current.map(recordKey));
  const previousKeys = new Set(inputs(snapshot.inventory).map(recordKey));
  const changedKeys = refresh ? currentKeys : new Set([...currentKeys].filter((key) => !previousKeys.has(key)));
  const researchKeys = new Set(current.map(researchKey));
  const researchStatus = snapshot.researchStatus.filter((failure) => researchKeys.has(failure.key));
  const failures = new Map(researchStatus.map((failure) => [failure.key, failure]));

  const candidates = groupResearch(local.online.filter((item) => changedKeys.has(item.inputKey)));
  const suppressed = refresh ? [] : candidates.filter((item) => failures.has(item.key)).map((item) => failures.get(item.key));
  const research = refresh ? candidates : candidates.filter((item) => !failures.has(item.key));
  const configurationChanges = local.inventory.configurations
    .filter((record) => record.review && changedKeys.has(recordKey(record)))
    .map((record) => ({ inputKey: recordKey(record), ...record }));
  const currentPaths = new Set(local.inventory.configurations.map((record) => record.path));
  for (const record of snapshot.inventory.configurations) {
    if (record.review && !currentPaths.has(record.path)) configurationChanges.push({ ...record, removed: true });
  }
  saveSnapshot(state, {
    ...snapshot,
    fingerprint: prepared.fingerprint,
    codeStandardsDigest: standards.digest,
    inventory: local.inventory,
    checked: snapshot.checked.filter((key) => currentKeys.has(key)),
    researchStatus,
  });

  return {
    status: refresh ? "refresh" : "changed",
    packageManager: prepared.lockfile.manager,
    workspaceCount: prepared.workspaces.length,
    changedInputs: changedKeys.size,
    ...(refresh || standards.digest !== snapshot.codeStandardsDigest ? { codeStandards: standards.workspaces } : {}),
    ...mismatchReport(local.inventory),
    bundle: local.bundle.filter((item) => changedKeys.has(item.inputKey)),
    ...(configurationChanges.length ? { configurationChanges } : {}),
    budget: { autoLimit: onlineLimit, requiresDecision: !refresh && research.length > onlineLimit },
    research, suppressed, skipped: snapshot.skipped,
  };
}

function main() {
  const { positionals, values } = parseArgs({
    allowPositionals: true,
    options: { refresh: { type: "boolean", default: false } },
  });
  const [command, directory, extra] = positionals;
  if (extra || !["scan", "record"].includes(command) || (command === "record" && values.refresh)) {
    throw new Error("Usage: collect-inventory.mjs scan [project-root] [--refresh] | record [project-root] < outcomes.json");
  }
  const root = realpathSync(directory ?? ".");
  if (command === "scan") return scan(root, values.refresh);
  const outcomes = JSON.parse(readFileSync(0, "utf8"));
  const state = loadSnapshot(root);
  if (state.snapshot.fingerprint === null) throw new Error("Scan the project before recording outcomes");
  return recordOutcomes(state, outcomes, root);
}

try {
  console.log(JSON.stringify(main()));
} catch (error) {
  console.error("vc-project: " + error.message);
  process.exitCode = 1;
}
