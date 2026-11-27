---
name: vc-project
description: Initialize or refresh project-local Codex tooling and code standards in JavaScript and TypeScript repositories. Use for vc-project setup, explicit refresh, or a changed inventory from AGENTS.md. Discover maintainer-backed Skills, MCP, Hooks, and bundled guidance. Review formatting, linting, and ESLint deprecated API checks through structured questions.
---

# vc-project

The collector requires Node.js 22.17 or later. It reads package-manager metadata locally and provides the work list.

## Run the local check

- Run `node <skill-directory>/scripts/collect-inventory.mjs scan <project-root>` after a successful direct dependency addition and on the first turn of a session. For setup or an explicit refresh, add `--refresh`. Reuse this turn's result when it covers the requested mode. If an automatic scan already ran and the user requests a refresh, run it again with `--refresh`.
- Resume the task on `not-a-js-project` or `unchanged`, noting relevant mismatches. On `changed` or `refresh`, use the returned work list. The collector has recorded the observation.
- Use `bundle` to locate packaged Skills and documentation directly. Confirm that the material applies to the installed version and the consuming workspace. Scope guide updates to verified inputs.
- For `configurationChanges`, reuse the recorded ownership and locally review the effect on commands and domain guides. Review changes unrelated to the current task during wrap-up. Read source-based configuration without executing it. Update guidance that depended on a configuration reported as removed.
- Use `lockfileResolution` to establish the project's expected package and version. For each `installed-mismatch`, report the installed and lockfile resolutions. Treat bundled guidance as evidence for the installed copy and research the expected version from the lockfile. Keep affected version-sensitive findings and setup pending until the two resolutions match. Continue unrelated work.
- Read the [collector contract](references/inventory.md) for the output, snapshot fields, and recording commands. The [JSON Schema](references/snapshot.schema.json) and [minimal snapshot](references/snapshot.example.json) define the on-disk format.

## Maintain code standards

When the scan returns `codeStandards`, follow the [code standards workflow](references/code-standards.md). On automatic runs, handle it during wrap-up unless the current task needs it. Include the template's [code quality metrics and review guidance](assets/code-standards.md#code-quality-metrics) alongside verified workspace checks in `docs/agents/code-standards.md`.

If formatting or linting is missing, ask whether to adopt Biome (recommended) or complete the ESLint and Prettier setup. Enforce `@typescript-eslint/no-deprecated` at error severity through the project's normal lint command or required check, including alongside Biome. Ask before enabling or installing the check. Present existing uses for a separate migration decision.

## Keep automatic runs within budget

The automatic entry point is local. On a result with work in `research`, prioritize the user's task, then review the candidates during wrap-up. Review at most five grouped inputs automatically. If `budget.requiresDecision` is true, use the [review timing question](references/questions.md) to let the user choose when to review the batch. Begin early or exceed the limit only after they choose Review now. A deferred batch remains available through an explicit refresh.

For each selected input, including those returned by `--refresh`, match its version, workspace, and relevant settings to facts already verified in this session or its domain guide. When those facts cover the proposals, go directly to the local setup and decision check. Look up the maintainer's documented source and one relevant versioned page only for missing evidence. Keep private names and sources within the project. Use the user's explicit target when they request research for a particular dependency.

After verifying configuration ownership, record the technology, official source, and fields that affect tooling, commands, or guidance. Record this even when an optional setup decision is pending. Keep reusable verified facts and their version or configuration scope in the domain guide as appropriate. When the remaining work is a user decision, resume at that decision with the verified findings already in hand.

Record verified outages and missing upstream pages with `record`. The collector suppresses that input at the same resolved version on subsequent automatic scans. An explicit refresh permits another attempt. If the current environment is known to be offline, record that finding for the selected batch and resume the task.

## Confirm and apply optional changes

Use [the Question List templates](references/questions.md). Verify the proposal against the effective Codex Skills, MCP, and Hooks configuration for the consuming workspace. Reuse a matching capability and deduplicate shared destinations. Show any existing definition that would be replaced and its exact replacement.

Compare proposals with the effective setup, explicit skips, and questions already sent in this conversation. Send a Question List only when at least one new choice remains. An unanswered entry in a partially submitted list retains its original question through same-session refreshes.

Continue independent work while awaiting choices. Apply only the specific change or tooling option the user submitted and record only explicit skips. Before acting on a delayed reply, verify that the proposal is still applicable and the approved change is still needed. Unanswered proposals can be revisited on explicit refresh in a later session. When the structured question tool is unavailable, report the affected items as pending and continue.

Keep shared Codex settings and Skills at the project root. Verify each command's working directory against the tool's documented configuration lookup and the consuming workspace. Run each command in its approved `cwd` with any approved, officially supported workspace or configuration path arguments. Present the revised action for approval if the directory or arguments change.

- Install the exact selected shared Skill from the project root into project scope with the Codex target. Verify discovery under the root `.agents/skills/`.
- Merge shared MCP entries into the root `.codex/config.toml`. For a STDIO server that needs a specific launch directory, set `mcp_servers.<name>.cwd` to the approved directory.
- Merge approved shared Hooks into the root's existing inline Hooks configuration or `.codex/hooks.json`. Use the client's native trust and reload flow to verify activation. Keep credentials in supported environment or secret settings.

Verify the resulting files and command working directories against the approved operation in the project context. Report configured and active entries and any required project trust, reload, or Hook review. [Codex Skills](https://developers.openai.com/codex/skills) · [Codex MCP](https://learn.chatgpt.com/docs/extend/mcp?surface=cli) · [Codex Hooks](https://developers.openai.com/codex/hooks)

## Maintain project guides

Use the [fixed AGENTS.md block](assets/agents-block.md) in root `AGENTS.md`. During setup, explicit refresh, or a verified domain change, maintain real project guidance in `docs/agents/` and update only the changed links. Attach a reading condition to each link and reuse existing guides. Keep unrelated root instructions and framework-managed sections intact and check that Codex's active root instructions include the block. [Codex AGENTS.md guide](https://developers.openai.com/codex/guides/agents-md)

Check the workspaces for user-facing pages, templates, or UI components in project source. When that UI exists or the current task introduces it, merge the [page and component content guide](assets/page-components.md) into the existing shared UI guide under `docs/agents/`, or create `docs/agents/page-components.md`. Keep one copy of the rules across workspaces. In `{{domain_links}}`, link to the actual guide with the reading condition `when implementing or reviewing user-facing pages or components`. Extend an existing link's condition and preserve its other triggers.
