import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join, posix, resolve } from "node:path";
import { parseJsonc, parseSyml } from "./vendor/parsers.mjs";

const lockfiles = {
  npm: ["npm-shrinkwrap.json", "package-lock.json"],
  pnpm: ["pnpm-lock.yaml"],
  yarn: ["yarn.lock"],
  bun: ["bun.lock", "bun.lockb"],
};

const registryVersion = /^\d+\.\d+\.\d+(?:[-+][\w.+-]+)?$/;

export function openLockfile(root, manifest) {
  const declared = manifest.packageManager?.split("@")[0];
  const found = Object.keys(lockfiles).filter((manager) =>
    lockfiles[manager].some((file) => existsSync(join(root, file))),
  );
  const pnpmWorkspace = join(root, "pnpm-workspace.yaml");
  const manager = declared ?? (existsSync(pnpmWorkspace) ? "pnpm" : found[0] ?? "npm");

  if (!Object.hasOwn(lockfiles, manager)) {
    throw new Error("Unsupported package manager: " + manager);
  }
  if (!declared && !existsSync(pnpmWorkspace) && found.length > 1) {
    throw new Error("Multiple package managers have lockfiles. Identify the active one in packageManager.");
  }

  const file = lockfiles[manager].find((name) => existsSync(join(root, name)));
  const source = file ? readFileSync(join(root, file)) : null;
  const patterns = manager === "pnpm" && existsSync(pnpmWorkspace)
    ? parseSyml(readFileSync(pnpmWorkspace, "utf8")).packages ?? []
    : Array.isArray(manifest.workspaces) ? manifest.workspaces : manifest.workspaces?.packages ?? [];
  return { manager, file, source, patterns };
}

export function targetName(name, specifier) {
  return /^npm:((?:@[^/]+\/)?[^@/]+)@/.exec(specifier)?.[1] ?? name;
}

function evidence(name, version) {
  return typeof version === "string" && registryVersion.test(version) ? { name, version } : null;
}

function localPackage(root, workspace, reference, name) {
  const path = resolve(root, workspace, reference.replace(/^(?:workspace:|link:|file:|portal:)/, ""));
  const manifest = join(path, "package.json");
  if (!existsSync(manifest)) return null;
  const { name: resolvedName, version } = JSON.parse(readFileSync(manifest, "utf8"));
  return evidence(resolvedName ?? name, version);
}

function fromLocator(locator, name) {
  const bound = /^(?:(@[^/]+\/[^@]+|[^@]+)@)?(?:npm:)?(\d+\.\d+\.\d+(?:[-+][\w.+-]+)?)/.exec(locator);
  return bound ? evidence(bound[1] ?? name, bound[2]) : null;
}

function npmLookup(data, root, { workspace, section, declaredName, specifier }, name) {
  if (!data.packages) {
    return workspace === "." ? evidence(name, data.dependencies?.[declaredName]?.version) : null;
  }
  const lockedSpecifier = data.packages[workspace === "." ? "" : workspace]?.[section]?.[declaredName];
  if (lockedSpecifier !== specifier) return null;
  let directory = workspace;
  while (true) {
    const entry = data.packages[posix.join(directory, "node_modules", declaredName)];
    if (entry?.link) return localPackage(root, ".", entry.resolved, name);
    if (entry) return evidence(entry.name ?? name, entry.version);
    if (directory === ".") return null;
    directory = posix.dirname(directory);
  }
}

function pnpmLookup(data, root, { workspace, section, declaredName, specifier }, name) {
  const importer = data.importers?.[workspace] ?? (workspace === "." ? data : {});
  const entry = importer[section]?.[declaredName];
  if (!entry) return null;
  const lockedSpecifier = typeof entry === "string" ? importer.specifiers?.[declaredName] : entry.specifier;
  if (lockedSpecifier !== specifier) return null;
  const version = typeof entry === "string" ? entry : entry.version;
  if (/^(?:link:|file:|workspace:)/.test(version)) return localPackage(root, workspace, version, name);
  // Parenthesized suffixes describe the peer context, separate from the package locator.
  const [locator] = version.split("(", 1);
  return fromLocator(locator.replace(/^\//, ""), name);
}

function yarnLookup(descriptors, root, { workspace, declaredName, specifier }, name) {
  const exact = declaredName + "@" + specifier;
  const entry = descriptors.get(exact) ?? descriptors.get(declaredName + "@npm:" + specifier);
  if (!entry) return null;
  const resolution = entry.resolution;
  const local = typeof resolution === "string" && /@((?:workspace|file|link|portal):.+)$/.exec(resolution);
  if (local) return localPackage(root, local[1].startsWith("workspace:") ? "." : workspace, local[1], name);
  return evidence(fromLocator(resolution ?? "", name)?.name ?? name, entry.version);
}

function bunLookup(data, root, { workspace, section, declaredName, specifier }, name) {
  const importer = data.workspaces?.[workspace === "." ? "" : workspace];
  if (importer?.[section]?.[declaredName] !== specifier) return null;
  const nested = importer?.name && data.packages?.[importer.name + "/" + declaredName];
  const entry = nested ?? data.packages?.[declaredName];
  if (!entry) return null;
  const reference = entry[0];
  const local = /@((?:workspace|file|link):.*)$/.exec(reference);
  if (local) return localPackage(root, local[1].startsWith("workspace:") ? "." : workspace, local[1], name);
  return fromLocator(reference, name);
}

export function lockedPackages(root, { manager, file, source }) {
  if (!source) return () => null;
  if (manager === "npm") {
    const data = JSON.parse(source);
    return (input, name) => npmLookup(data, root, input, name);
  }

  if (file === "bun.lock") {
    const errors = [];
    const data = parseJsonc(source.toString("utf8"), errors, { allowTrailingComma: true });
    if (errors.length > 0) throw new Error("Invalid bun.lock JSONC");
    return (input, name) => bunLookup(data, root, input, name);
  }

  let text = source.toString("utf8");
  if (file === "bun.lockb") {
    // Bun exposes its binary lock as Yarn lock text without running an install.
    const result = spawnSync("bun", [join(root, file)], { encoding: "utf8", timeout: 2000, maxBuffer: 16 * 1024 * 1024 });
    if (result.status !== 0) throw new Error("Could not read bun.lockb with the local Bun executable");
    text = result.stdout;
  }
  const data = parseSyml(text);
  if (manager === "pnpm") return (input, name) => pnpmLookup(data, root, input, name);

  const descriptors = new Map();
  for (const [key, entry] of Object.entries(data)) {
    for (const descriptor of key.split(/,\s+/)) descriptors.set(descriptor, entry);
  }
  return (input, name) => yarnLookup(descriptors, root, input, name);
}
