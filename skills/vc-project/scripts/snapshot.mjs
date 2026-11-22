import { randomUUID } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, realpathSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { observeInventory, prepareInventory, recordKey, researchKey, sorted } from "./inventory.mjs";
import { validateSnapshot } from "./vendor/snapshot-validator.mjs";

const schema = JSON.parse(readFileSync(new URL("../references/snapshot.schema.json", import.meta.url), "utf8"));
const schemaVersion = schema.properties.schemaVersion.const;
const snapshotPath = ".agents/vc-project.json";

function emptySnapshot() {
  return {
    schemaVersion, fingerprint: null, inventory: { packages: [], configurations: [] },
    checked: [], skipped: [], researchStatus: [],
  };
}

function validate(snapshot) {
  if (validateSnapshot(snapshot)) return;
  const [error] = validateSnapshot.errors;
  throw new Error(snapshotPath + (error.instancePath || "") + " " + error.message);
}

function skipKey({ kind, source, identity, destination }) {
  return JSON.stringify([kind, source, identity, destination]);
}

function ordered(record, definition) {
  return Object.fromEntries(schema.definitions[definition].required.map((key) => [key, record[key]]));
}

function serialize(snapshot) {
  const packages = sorted(snapshot.inventory.packages.map((item) => ordered({
    ...item,
    lockfileResolution: item.lockfileResolution && ordered(item.lockfileResolution, "resolution"),
  }, "package")), (item) => JSON.stringify([item.workspace, item.section, item.declaredName]));
  const configurations = sorted(snapshot.inventory.configurations.map((item) => ordered({
    ...item,
    review: item.review && ordered(item.review, "configurationReview"),
  }, "configuration")), (item) => item.path);
  const data = {
    schemaVersion: snapshot.schemaVersion,
    fingerprint: snapshot.fingerprint,
    inventory: { packages, configurations },
    checked: [...new Set(snapshot.checked)].sort(),
    skipped: sorted(snapshot.skipped.map((item) => ordered(item, "skip")), skipKey),
    researchStatus: sorted(snapshot.researchStatus.map((item) => ordered(item, "researchFailure")), (item) => item.key),
  };
  return JSON.stringify(data, null, 2) + "\n";
}

export function loadSnapshot(root) {
  const path = join(root, snapshotPath);
  const previous = existsSync(path) ? readFileSync(path, "utf8") : null;
  let snapshot = previous === null ? emptySnapshot() : JSON.parse(previous);

  if (!Object.hasOwn(snapshot, "schemaVersion") && Array.isArray(snapshot.checked) && Array.isArray(snapshot.skipped)) {
    // Adopt the earlier instruction-only format once and retain every identifiable decline.
    const skipped = snapshot.skipped.map((skip) => ({
      ...skip, kind: skip.kind === "mcp-server" ? "mcp" : skip.kind,
    }));
    snapshot = { ...emptySnapshot(), skipped };
  }
  if (snapshot.schemaVersion === 1) {
    // Rescan once to compare installed packages with the current lockfile before reusing outcomes.
    const packages = snapshot.inventory.packages.map((item) => ({
      ...item,
      lockfileResolution: item.installState === "lockfile-only"
        ? { name: item.resolvedName, version: item.version }
        : null,
    }));
    snapshot = { ...snapshot, schemaVersion: 2, inventory: { ...snapshot.inventory, packages } };
  }
  if (snapshot.schemaVersion === 2) {
    // Earlier observations establish package state, but contain no baseline for configuration values.
    snapshot = { ...snapshot, schemaVersion, fingerprint: null, inventory: { ...snapshot.inventory, configurations: [] } };
  }
  validate(snapshot);
  return { previous, snapshot, path };
}

export function saveSnapshot({ previous, path }, snapshot) {
  validate(snapshot);
  const contents = serialize(snapshot);
  if (contents === previous) return false;

  const directory = dirname(path);
  mkdirSync(directory, { recursive: true });
  if (realpathSync(directory) !== directory) throw new Error("The project .agents directory must be local to the project");

  const temp = path + "." + randomUUID() + ".tmp";
  try {
    writeFileSync(temp, contents, { flag: "wx" });
    const current = existsSync(path) ? readFileSync(path, "utf8") : null;
    if (current !== previous) throw new Error("The vc-project snapshot changed during this operation. Read it again before recording results.");
    renameSync(temp, path);
  } finally {
    rmSync(temp, { force: true });
  }
  return true;
}

function applyConfigurationReviews(configurations, reviews, prepared) {
  const byKey = new Map(configurations.map((item) => [recordKey(item), item]));
  const files = new Map(prepared.configurationFiles.map((file) => [file.path, file]));
  const reviewed = new Map();
  for (const { inputKey, technology, source, fields } of reviews) {
    const input = byKey.get(inputKey);
    if (!input) throw new Error("A reviewed configuration is no longer in the snapshot");
    if (fields !== null && (!Array.isArray(fields) || fields.some((field) => typeof field !== "string")
        || files.get(input.path).data === undefined)) {
      throw new Error("Reviewed fields require structured configuration data. Use null for source files");
    }
    reviewed.set(input.path, { inputKey, review: { technology, source, fields: fields && [...new Set(fields)].sort() } });
  }
  const next = observeInventory(prepared, configurations.map((item) => {
    const update = reviewed.get(item.path);
    return update ? { ...item, review: update.review } : item;
  }));
  const inputKeys = Object.fromEntries(next.configurations.filter(({ path }) => reviewed.has(path)).map((item) => [
    reviewed.get(item.path).inputKey, recordKey(item),
  ]));
  return { configurations: next.configurations, fingerprint: next.fingerprint, inputKeys };
}

export function recordOutcomes(state, outcomes, root) {
  const snapshot = state.snapshot;
  const packages = snapshot.inventory.packages;
  const configurations = snapshot.inventory.configurations;
  const inputs = [...packages, ...configurations];
  const keys = new Set(inputs.map(recordKey));
  const research = new Map(inputs.map((item) => [researchKey(item), item.lockfileResolution?.version ?? item.version ?? null]));
  const allowed = new Set(["checked", "skipped", "unskip", "researchStatus", "clearResearch", "configurationReviews"]);
  for (const [key, value] of Object.entries(outcomes)) {
    if (!allowed.has(key) || !Array.isArray(value)) throw new Error("Invalid result field: " + key);
  }
  const reviews = outcomes.configurationReviews ?? [];
  const prepared = outcomes.checked?.length || reviews.length ? prepareInventory(root) : null;
  if ((outcomes.checked?.length || reviews.length)
      && (!prepared || observeInventory(prepared, configurations).fingerprint !== snapshot.fingerprint)) {
    throw new Error("Inventory input changed. Scan the project again before recording verified inputs");
  }
  if (outcomes.checked?.some((key) => !keys.has(key))) throw new Error("A checked input is no longer in the snapshot");
  if (outcomes.checked?.length) {
    const mismatched = new Set(packages.filter((item) => item.installState === "installed-mismatch").map(recordKey));
    if (outcomes.checked.some((key) => mismatched.has(key))) {
      throw new Error("A checked input has different installed and lockfile resolutions");
    }
  }

  const skips = new Map(snapshot.skipped.map((skip) => [skipKey(skip), skip]));
  for (const skip of outcomes.unskip ?? []) skips.delete(skipKey(skip));
  for (const skip of outcomes.skipped ?? []) skips.set(skipKey(skip), skip);
  const failures = new Map(snapshot.researchStatus.map((failure) => [failure.key, failure]));
  for (const key of outcomes.clearResearch ?? []) failures.delete(key);
  for (const { key, status, reason } of outcomes.researchStatus ?? []) {
    if (!research.has(key)) throw new Error("The research input is no longer in the snapshot: " + key);
    failures.set(key, {
      key, status, reason, version: research.get(key), checkedAt: new Date().toISOString(),
    });
  }

  const reviewed = reviews.length ? applyConfigurationReviews(configurations, reviews, prepared) : null;
  const inputKeys = reviewed?.inputKeys ?? {};
  const changed = saveSnapshot(state, {
    ...snapshot,
    fingerprint: reviewed?.fingerprint ?? snapshot.fingerprint,
    inventory: { packages, configurations: reviewed?.configurations ?? configurations },
    checked: [
      ...snapshot.checked.filter((key) => (inputKeys[key] ?? key) === key),
      ...(outcomes.checked ?? []).map((key) => inputKeys[key] ?? key),
    ],
    skipped: [...skips.values()],
    researchStatus: [...failures.values()],
  });
  return { status: changed ? "recorded" : "unchanged", ...(reviewed ? { inputKeys } : {}) };
}
