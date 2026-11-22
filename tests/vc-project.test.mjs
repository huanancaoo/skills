import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const collector = fileURLToPath(new URL("../skills/vc-project/scripts/collect-inventory.mjs", import.meta.url));

function project(t, manifest = {}) {
  const root = mkdtempSync(join(tmpdir(), "vc-project-test-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  function write(path, contents) {
    mkdirSync(dirname(join(root, path)), { recursive: true });
    writeFileSync(join(root, path), typeof contents === "string" ? contents : JSON.stringify(contents));
  }
  function run(args, outcomes) {
    return JSON.parse(execFileSync(process.execPath, [collector, ...args], {
      cwd: root, encoding: "utf8", input: JSON.stringify(outcomes),
    }));
  }
  write("package.json", { private: true, ...manifest });
  return {
    write,
    scan: (...flags) => run(["scan", ".", ...flags]),
    record: (outcomes) => run(["record", "."], outcomes),
    snapshot: () => readFileSync(join(root, ".agents/vc-project.json"), "utf8"),
  };
}

test("bundled guidance receives the same explicit skip on refresh with no online candidates", (t) => {
  const p = project(t, { dependencies: { catalog: "1.0.0" } });
  p.write("node_modules/catalog/package.json", { name: "catalog", version: "1.0.0", private: true });
  p.write("node_modules/catalog/AGENTS.md", "The maintainer offers an optional documentation MCP.");
  const first = p.scan();
  const skip = {
    kind: "mcp", source: "node_modules/catalog/AGENTS.md", identity: "catalog", destination: ".codex/config.toml",
  };
  p.record({ checked: [first.bundle[0].inputKey], skipped: [skip] });
  const before = p.snapshot();
  assert.equal(p.scan().status, "unchanged");
  const refreshed = p.scan("--refresh");
  assert.equal(refreshed.status, "refresh");
  assert.deepEqual(refreshed.research, []);
  assert.deepEqual(refreshed.bundle[0].files, ["AGENTS.md"]);
  assert.deepEqual(refreshed.skipped, [skip]);
  assert.equal(p.snapshot(), before);
});

test("a schema-bearing JSONC file tracks selected fields across comments and formatting", (t) => {
  const p = project(t);
  const source = "https://example.org/schema";
  p.write("options.jsonc", `{ "$schema": "${source}", "registry": "one", "display": 1, }`);
  const [input] = p.scan().research[0].inputs;
  assert.equal(input.evidence, "schema:" + source);
  p.record({ configurationReviews: [{ inputKey: input.inputKey, technology: "Catalog", source, fields: ["/registry"] }] });
  const before = p.snapshot();
  p.write("options.jsonc", `{ // UI preference\n "display": 2, "registry": "one", "$schema": "${source}" }`);
  assert.equal(p.scan().status, "unchanged");
  assert.equal(p.snapshot(), before);
  p.write("options.jsonc", { $schema: source, registry: "two", display: 2 });
  const changed = p.scan();
  assert.equal(changed.configurationChanges[0].review.source, source);
  assert.deepEqual(changed.research, []);
});

test("a change to a selected YAML scalar's type invalidates its check", (t) => {
  const p = project(t);
  p.write("catalog.config.yaml", "adapter: false\n");
  const [input] = p.scan().research[0].inputs;
  const review = { inputKey: input.inputKey, technology: "Catalog", source: "docs/agents/catalog.md", fields: ["/adapter"] };
  p.record({ configurationReviews: [review], checked: [input.inputKey] });
  p.write("catalog.config.yaml", "adapter: false  # same flag\n");
  assert.equal(p.scan().status, "unchanged");
  p.write("catalog.config.yaml", 'adapter: "false"\n');
  const changed = p.scan();
  assert.equal(changed.configurationChanges[0].review.source, review.source);
  assert.deepEqual(changed.research, []);
  assert.deepEqual(JSON.parse(p.snapshot()).checked, []);
});

test("a preexisting YAML review survives the switch to typed values", (t) => {
  const p = project(t);
  p.write("catalog.config.yaml", 'adapter: "false"\n');
  const review = { technology: "Catalog", source: "docs/agents/catalog.md", fields: ["/adapter"] };
  // Captured with the original v3 collector while adapter was the boolean false.
  p.write(".agents/vc-project.json", {
    schemaVersion: 3, fingerprint: "e9b66a63ae4e4b990d3103d68cacaad3d39da266a4cfb54a1430448ddb1470d7",
    inventory: { packages: [], configurations: [{
      workspace: ".", path: "catalog.config.yaml", evidence: "filename:catalog.config.yaml",
      digest: "421e62a97db3d54e2d46e859402f8bf3e63547a604206a17ff0dea8d0d2d66aa", review,
    }] },
    checked: ["e5636fc5440723514bf5b8f77587ec5e1ffa97734fe574c14ae674a51c9471d2"], skipped: [], researchStatus: [],
  });
  const refreshed = p.scan();
  assert.deepEqual(refreshed.configurationChanges[0].review, review);
  assert.deepEqual(refreshed.research, []);
  assert.deepEqual(JSON.parse(p.snapshot()).checked, []);
  assert.equal(p.scan().status, "unchanged");
});

test("package inspection accepts only real guidance files and directories", (t) => {
  const p = project(t, { dependencies: { catalog: "1.0.0" } });
  const pkg = "node_modules/catalog/";
  p.write(pkg + "package.json", { name: "catalog", version: "1.0.0" });
  p.write(pkg + "skills", "ordinary data file");
  p.write(pkg + "README.md/notes", "not a README file");
  p.write(pkg + "AGENTS.md/notes", "not an instruction file");
  p.write(pkg + "README", "The maintainer offers an optional documentation MCP.");
  p.write(pkg + "docs/README.mdx", "# Query guide\n");
  const result = p.scan();
  assert.deepEqual(result.bundle[0].files, ["docs/README.mdx"]);
  assert.equal(result.research[0].reason, "published-agent-guidance");
});
