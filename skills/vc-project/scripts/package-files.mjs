import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { basename, dirname, join, posix, resolve } from "node:path";
import { unzipSync } from "./vendor/parsers.mjs";

const agentFile = /^(?:SKILL\.md|AGENTS\.md|(?:\.agents\/)?skills\/(?:[^/]+\/)?SKILL\.md|dist\/skills\/(?:[^/]+\/)?SKILL\.md|(?:dist\/)?docs\/(?:README|index)\.mdx?)$/;
const skillDirectories = ["skills", ".agents/skills", "dist/skills"];
const docDirectories = ["docs", "dist/docs"];
const readmeNames = ["README.md", "README"];

function inlinedPnpState(text) {
  const match = /const RAW_RUNTIME_STATE\s*=\s*'/.exec(text);
  if (!match) throw new Error("Yarn's installed PnP state is missing or unreadable");
  const start = match.index + match[0].length;
  let end = start;
  while (end < text.length && text[end] !== "'") end += text[end] === "\\" ? 2 : 1;
  if (end === text.length) throw new Error("Incomplete Yarn PnP state");
  // Yarn escapes backslashes and apostrophes and uses line continuations in the data literal.
  const data = text.slice(start, end).replace(/\\(?:\r?\n|[\\'])/g, (escape) =>
    escape.length === 2 && escape[1] !== "\n" ? escape[1] : "\n",
  );
  return JSON.parse(data);
}

function physicalLocation(root, location) {
  const path = resolve(root, location);
  const match = /^(.*)[\\/](?:__virtual__|\$\$virtual)[\\/][^\\/]+[\\/](\d+)[\\/](.+)$/.exec(path);
  if (!match) return path;
  let base = match[1];
  for (let depth = Number(match[2]); depth > 0 && dirname(base) !== base; depth--) base = dirname(base);
  return resolve(base, match[3]);
}

export function pnpInstallations(root) {
  const loader = join(root, ".pnp.cjs");
  const dataFile = join(root, ".pnp.data.json");
  if (!existsSync(loader)) return null;
  const state = existsSync(dataFile) ? JSON.parse(readFileSync(dataFile, "utf8")) : inlinedPnpState(readFileSync(loader, "utf8"));
  const registry = new Map(state.packageRegistryData.map(([name, entries]) => [name, new Map(entries)]));
  const workspaces = new Map();
  for (const { name, reference } of state.dependencyTreeRoots) {
    const information = registry.get(name)?.get(reference);
    if (information) workspaces.set(resolve(root, information.packageLocation), new Map(information.packageDependencies));
  }
  return (workspace, name) => {
    const dependency = workspaces.get(resolve(root, workspace))?.get(name);
    if (!dependency) return null;
    const [resolvedName, reference] = Array.isArray(dependency) ? dependency : [name, dependency];
    const information = registry.get(resolvedName)?.get(reference);
    return information ? physicalLocation(root, information.packageLocation) : null;
  };
}

export function installedLocation(root, workspace, name, pnp) {
  if (pnp) return pnp(workspace, name);
  let directory = workspace;
  while (true) {
    const location = join(root, directory, "node_modules", name);
    if (existsSync(join(location, "package.json"))) return location;
    if (directory === ".") return null;
    directory = posix.dirname(directory);
  }
}

function archiveLocation(location) {
  return /^(.*?\.zip)[\\/](.+)$/.exec(location);
}

export function preparePackage(location) {
  if (!location) return null;
  const archive = archiveLocation(location);
  if (archive) {
    const stats = statSync(archive[1], { throwIfNoEntry: false });
    return stats?.isFile() ? { location, stamp: [location, basename(archive[1]), stats.size] } : null;
  }
  const manifest = join(location, "package.json");
  if (!existsSync(manifest)) return null;
  const source = readFileSync(manifest, "utf8");
  return { location, stamp: [location, source], manifest: JSON.parse(source) };
}

function packageReadme(location) {
  for (const name of readmeNames) {
    const path = join(location, name);
    const stats = statSync(path, { throwIfNoEntry: false });
    if (stats?.isFile() && stats.size <= 96 * 1024) return readFileSync(path, "utf8").slice(0, 16 * 1024);
  }
  return "";
}

export function inspectPackage(prepared) {
  if (!prepared) return { manifest: null, files: [], readme: "", location: null };
  const { location, manifest } = prepared;
  const archive = archiveLocation(location);
  const files = new Set();
  if (archive) {
    const prefix = archive[2].replaceAll("\\", "/") + "/";
    const entries = unzipSync(readFileSync(archive[1]), {
      filter: ({ name, originalSize }) => {
        if (!name.startsWith(prefix)) return false;
        const relative = name.slice(prefix.length);
        if (agentFile.test(relative)) files.add(relative);
        return relative === "package.json" || (readmeNames.includes(relative) && originalSize <= 96 * 1024);
      },
    });
    const buffer = entries[prefix + "package.json"];
    const readme = readmeNames.find((name) => entries[prefix + name]);
    return {
      manifest: buffer ? JSON.parse(Buffer.from(buffer)) : null,
      files: [...files].sort(),
      readme: readme ? Buffer.from(entries[prefix + readme]).toString("utf8", 0, 16 * 1024) : "",
      location,
    };
  }

  const candidates = ["SKILL.md", "AGENTS.md"];
  for (const dir of docDirectories) {
    for (const name of ["README.md", "README.mdx", "index.md", "index.mdx"]) candidates.push(dir + "/" + name);
  }
  for (const dir of skillDirectories) {
    candidates.push(dir + "/SKILL.md");
    const base = join(location, dir);
    if (!statSync(base, { throwIfNoEntry: false })?.isDirectory()) continue;
    for (const entry of readdirSync(base, { withFileTypes: true })) {
      if (entry.isDirectory()) candidates.push(dir + "/" + entry.name + "/SKILL.md");
    }
  }
  return {
    manifest,
    files: candidates.filter((file) => statSync(join(location, file), { throwIfNoEntry: false })?.isFile()).sort(),
    readme: packageReadme(location),
    location,
  };
}
