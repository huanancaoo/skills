import { createHash } from "node:crypto";
import { existsSync, globSync, readFileSync, readdirSync, realpathSync, statSync } from "node:fs";
import { isAbsolute, join, posix, relative, resolve } from "node:path";
import { lockedPackages, openLockfile, targetName } from "./lockfiles.mjs";
import { inspectPackage, installedLocation, pnpInstallations, preparePackage } from "./package-files.mjs";
import { parseConfigYaml, parseJsonc } from "./vendor/parsers.mjs";

const sections = ["dependencies", "devDependencies", "optionalDependencies", "peerDependencies"];
const ignored = new Set([
  ".git", ".agents", ".cache", ".next", ".nuxt", ".output", ".turbo", ".yarn", "node_modules",
  "build", "coverage", "dist", "fixtures", "__fixtures__",
]);
const packageName = /^(?:@[\w.-]+\/)?[\w][\w.-]*$/;
const namedConfig = /^[\w.-]+\.config\.(?:[cm]?[jt]sx?|jsonc?|ya?ml|toml)$/i;
const typeProjectConfig = /^(?:js|ts)config(?:\.[\w.-]+)?\.json$/;
const standardsConfigs = [
  /^biome\.jsonc?$/,
  /^(?:eslint\.config\.[cm]?[jt]s|\.eslintrc(?:\.(?:c?js|json|ya?ml))?)$/,
  /^(?:prettier\.config\.[cm]?[jt]s|\.prettierrc(?:\.(?:[cm]?[jt]s|json5?|ya?ml|toml))?)$/,
  typeProjectConfig,
];
const standardsPackages = new Set([
  "eslint", "prettier", "@biomejs/biome", "typescript", "typescript-eslint",
  "@typescript-eslint/eslint-plugin", "@typescript-eslint/parser",
]);
const localSpec = /^(?:workspace:|file:|link:|portal:|patch:|\.{1,2}\/|\/)/;
const agentSignal = /\b(?:MCP|model context protocol|coding agents?|agent skills?)\b|(?:AGENTS|SKILL)\.md/i;
const categorySignal = /\b(?:framework|runtime|hosting|cloud|database|authentication|testing|bundler|compiler|toolchain)\b/i;

export function sorted(items, key) {
  return [...items].sort((first, second) => {
    const left = key(first);
    const right = key(second);
    return left < right ? -1 : left > right ? 1 : 0;
  });
}

export function hash(value) {
  return createHash("sha256").update(typeof value === "string" || Buffer.isBuffer(value) ? value : JSON.stringify(value)).digest("hex");
}

function packageKeys({ workspace, section, declaredName, specifier, resolvedName, version, installState, lockfileResolution }) {
  const key = [workspace, section, declaredName, specifier, resolvedName, version, installState];
  // A different lockfile target changes the pending conclusion even when the installed copy stays the same.
  if (installState === "installed-mismatch") key.push(lockfileResolution.name, lockfileResolution.version);
  return key;
}

function configKeys({ workspace, path, evidence, digest }) {
  return [workspace, path, evidence, digest];
}

export function recordKey(record) {
  return hash(Object.hasOwn(record, "path") ? configKeys(record) : packageKeys(record));
}

export function researchKey(record) {
  if (Object.hasOwn(record, "path")) return "config:" + record.evidence;
  const name = record.lockfileResolution?.name ?? record.resolvedName;
  const version = record.lockfileResolution?.version ?? record.version;
  return "package:" + name + "@" + (version ?? "unresolved");
}

function workspacePaths(root, patterns) {
  const manifests = new Set(["package.json"]);
  for (const raw of patterns) {
    const excluded = raw.startsWith("!");
    const pattern = raw.slice(excluded ? 1 : 0);
    if (isAbsolute(pattern) || pattern.split("/").includes("..")) {
      throw new Error("Workspace declarations must be relative to the project root");
    }
    const glob = posix.join(pattern, "package.json");
    const matches = globSync(glob, {
      cwd: root,
      exclude: (path) => path.split(/[\\/]/).some((part) => ignored.has(part)),
    });
    for (const match of matches) {
      const path = match.replaceAll("\\", "/");
      if (path === "package.json") continue;
      const real = relative(root, realpathSync(join(root, path)));
      if (real === ".." || real.startsWith(".." + (process.platform === "win32" ? "\\" : "/")) || isAbsolute(real)) continue;
      if (excluded) manifests.delete(path);
      else manifests.add(path);
    }
  }
  return [...manifests].sort();
}

function httpsUrl(value) {
  if (typeof value !== "string") return null;
  const url = URL.parse(value.replace(/^git\+/, ""));
  if (!url || url.protocol !== "https:") return null;
  url.username = "";
  url.password = "";
  url.search = "";
  url.hash = "";
  return url.href;
}

function snapshotSpecifier(specifier) {
  const url = URL.parse(specifier);
  if (!url?.host || (!url.username && !url.password && !url.search)) return specifier;
  url.username = "";
  url.password = "";
  url.search = "";
  return url.href;
}

function configurationFile(path, name) {
  const named = namedConfig.test(name);
  const standard = standardsConfigs.some((pattern) => pattern.test(name));
  const json = /\.jsonc?$/i.test(name) && !/^(?:package(?:-lock)?|npm-shrinkwrap|skills-lock)\.json$/.test(name);
  if (!named && !standard && (!json || statSync(path).size > 128 * 1024)) return null;

  const source = readFileSync(path, "utf8");
  let data;
  if (json) {
    const errors = [];
    const value = parseJsonc(source, errors, { allowTrailingComma: true });
    if (!errors.length) data = value;
  } else if (/\.ya?ml$/i.test(name) || name === ".prettierrc" || name === ".eslintrc") {
    try {
      data = parseConfigYaml(source);
    } catch {
      // An unreadable YAML file still has a local source revision to review.
    }
  }
  const schema = httpsUrl(data?.$schema);
  if (!schema && !named && !standard) return null;
  const evidence = schema ? "schema:" + schema : "filename:" + name;
  return { source, data, evidence, standard, researchOwnership: Boolean(schema || named) };
}

function workspaceConfigurations(root, workspace) {
  const records = [];
  for (const folder of [".", ".config", "config"]) {
    const directory = join(root, workspace, folder);
    const stats = statSync(directory, { throwIfNoEntry: false });
    if (!stats?.isDirectory() || realpathSync(directory) !== resolve(root, workspace, folder)) continue;
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      if (!entry.isFile()) continue;
      const file = configurationFile(join(directory, entry.name), entry.name);
      if (file) records.push({ workspace, path: posix.join(workspace, folder, entry.name), ...file });
    }
  }
  return sorted(records, (record) => record.path);
}

function workspaceStandards(workspace, manifest, files) {
  const configurations = files.filter((file) => file.standard);
  const scripts = Object.entries(manifest.scripts ?? {}).filter(([name, command]) =>
    typeof command === "string" && (/(?:^|[:_-])(?:lint|format|check)(?:$|[:_-])/i.test(name) || /\b(?:eslint|prettier|biome)\b/.test(command)),
  );
  const settings = ["eslintConfig", "prettier"].filter((name) => Object.hasOwn(manifest, name));
  const data = {
    scripts: Object.fromEntries(scripts),
    settings: Object.fromEntries(settings.map((name) => [name, manifest[name]])),
  };
  // A shared ownership review can track different fields from the ones that determine lint coverage.
  const revisions = configurations.map((file) => {
    const fields = typeProjectConfig.test(posix.basename(file.path))
      ? ["/extends", "/references", "/files", "/include", "/exclude", "/compilerOptions"]
      : null;
    return [file.path, configurationDigest(file, fields)];
  });
  return {
    workspace, settings,
    scripts: scripts.map(([name]) => name).sort(),
    configurations: configurations.map((file) => file.path),
    digest: hash([configurationDigest({ data, path: "package.json" }, null), revisions]),
  };
}

export function codeStandardsInventory(workspaces, packages) {
  const scopes = new Map(workspaces.map(({ workspace, settings, configurations, scripts }) => [
    workspace, { workspace, settings, configurations, scripts, dependencies: [] },
  ]));
  const toolKeys = [];
  for (const item of packages) {
    const { declaredName, resolvedName, section, version } = item;
    if (![declaredName, resolvedName, item.lockfileResolution?.name].some((name) => standardsPackages.has(name))) continue;
    scopes.get(item.workspace).dependencies.push({ section, declaredName, resolvedName, version });
    toolKeys.push(recordKey(item));
  }
  const digest = hash([workspaces.map((item) => [item.workspace, item.digest]), toolKeys]);
  return { digest, workspaces: sorted(scopes.values(), (scope) => scope.workspace) };
}

export function prepareInventory(root) {
  const manifestFile = join(root, "package.json");
  if (!existsSync(manifestFile)) return null;
  const manifest = JSON.parse(readFileSync(manifestFile, "utf8"));
  const lockfile = openLockfile(root, manifest);
  const pnp = lockfile.manager === "yarn" ? pnpInstallations(root) : null;
  const workspaces = workspacePaths(root, lockfile.patterns);
  const manifests = workspaces.map((path) => [path, readFileSync(join(root, path), "utf8")]);
  const configurationFiles = [];
  const standards = [];
  const packages = [];
  const installations = new Map();

  for (const [path, source] of manifests) {
    const workspace = posix.dirname(path);
    const project = JSON.parse(source);
    const files = workspaceConfigurations(root, workspace);
    configurationFiles.push(...files);
    standards.push(workspaceStandards(workspace, project, files));
    for (const section of sections) {
      for (const declaredName of Object.keys(project[section] ?? {}).sort()) {
        if (!packageName.test(declaredName)) throw new Error("Invalid dependency name in " + path);
        const specifier = project[section][declaredName];
        if (typeof specifier !== "string" || specifier.length === 0) {
          throw new Error("Invalid dependency specifier in " + path + " for " + declaredName);
        }
        const location = installedLocation(root, workspace, declaredName, pnp);
        if (location && !installations.has(location)) installations.set(location, preparePackage(location));
        const prepared = location ? installations.get(location) : null;
        packages.push({ workspace, section, declaredName, specifier, prepared });
      }
    }
  }

  const packageFingerprint = hash([
    lockfile.manager, lockfile.file, lockfile.source && hash(lockfile.source), manifests,
    packages.map(({ prepared }) => prepared?.stamp.slice(1) ?? null),
  ]);
  return { packageFingerprint, packages, configurationFiles, lockfile, workspaces, standards };
}

function fieldValue(data, pointer) {
  let value = data;
  for (const part of pointer.slice(1).split("/")) {
    const field = part.replaceAll("~1", "/").replaceAll("~0", "~");
    if (value === null || typeof value !== "object" || !Object.hasOwn(value, field)) return [pointer];
    value = value[field];
  }
  return [pointer, value];
}

function configurationDigest({ data, source, path }, fields) {
  if (data === undefined) return hash(["source", source.replaceAll("\r\n", "\n")]);
  const relevant = fields === null ? data : fields.toSorted().map((field) => fieldValue(data, field));
  // Older YAML digests treated every scalar as a string. A new tag invalidates those baselines once.
  const format = /\.ya?ml$/i.test(path) ? "yaml-core" : "data";
  const canonical = JSON.stringify([format, relevant], (_, value) => {
    if (value === null || typeof value !== "object" || Array.isArray(value)) return value;
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, value[key]]));
  });
  return hash(canonical);
}

export function observeInventory(prepared, previousConfigurations) {
  const previousByPath = new Map(previousConfigurations.map((record) => [record.path, record]));
  const configurations = prepared.configurationFiles.map((file) => {
    const { workspace, path, evidence } = file;
    const previous = previousByPath.get(path);
    const review = previous?.evidence === evidence ? previous.review : null;
    return { workspace, path, evidence, digest: configurationDigest(file, review?.fields ?? null), review };
  });
  const fingerprint = hash([prepared.packageFingerprint, configurations.map(configKeys), prepared.standards.map((item) => item.digest)]);
  return { ...prepared, configurations, fingerprint };
}

function researchReason(name, specifier, { manifest, readme }) {
  if (/^@types\//.test(name) || manifest?.private || localSpec.test(specifier)) return null;
  const metadata = [name, manifest?.description, ...(manifest?.keywords ?? [])].join(" ");
  if (agentSignal.test(metadata) || agentSignal.test(readme)) return "published-agent-guidance";
  return categorySignal.test(metadata) ? "tooling-category" : null;
}

export function collectInventory(root, prepared) {
  const lookup = lockedPackages(root, prepared.lockfile);
  const inspected = new Map();
  const packages = [];
  const bundle = [];
  const online = [];
  for (const { prepared: installed, ...input } of prepared.packages) {
    const name = targetName(input.declaredName, input.specifier);
    const location = installed?.location ?? null;
    if (!inspected.has(location)) inspected.set(location, inspectPackage(installed));
    const found = inspected.get(location);
    const locked = lookup(input, name);
    const resolvedName = found.manifest?.name ?? locked?.name ?? name;
    const version = found.manifest ? found.manifest.version ?? null : locked?.version ?? null;
    let installState = locked ? "lockfile-only" : "unresolved";
    if (found.manifest) {
      installState = locked && (resolvedName !== locked.name || version !== locked.version)
        ? "installed-mismatch" : "installed";
    }
    const record = {
      ...input,
      specifier: snapshotSpecifier(input.specifier),
      resolvedName,
      version,
      installState,
      lockfileResolution: locked,
    };
    packages.push(record);

    if (found.files.length) {
      bundle.push({ inputKey: recordKey(record), record, packagePath: found.location, files: found.files });
    }
    const expectedName = locked?.name ?? resolvedName;
    const publisher = expectedName === resolvedName ? found : { manifest: null, readme: "" };
    const reason = researchReason(expectedName, input.specifier, publisher);
    if (reason) {
      const repository = publisher.manifest?.repository;
      online.push({
        inputKey: recordKey(record), researchKey: researchKey(record), version: locked?.version ?? version, record, reason,
        upstream: httpsUrl(typeof repository === "object" ? repository?.url : repository) ?? httpsUrl(publisher.manifest?.homepage),
      });
    }
  }
  // Standard-only files stay in the inventory when a schema is removed, without creating an online ownership task.
  const ownershipPaths = new Set(prepared.configurationFiles
    .filter((file) => file.researchOwnership)
    .map((file) => file.path));
  for (const record of prepared.configurations) {
    if (record.review || !ownershipPaths.has(record.path)) continue;
    online.push({
      inputKey: recordKey(record), researchKey: researchKey(record), version: null, record,
      reason: "configuration-ownership",
      upstream: record.evidence.startsWith("schema:") ? record.evidence.slice(7) : null,
    });
  }
  return { inventory: { packages, configurations: prepared.configurations }, bundle, online };
}
