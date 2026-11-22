# Project code standards

## Verify the current setup

Use the collector's `codeStandards` workspace records to locate direct dependencies, config files, manifest settings, and relevant scripts. Read their actual scope, including inherited root settings, shared presets, delegated scripts, and CI commands. A dependency declaration or a script name alone is a lead. Account for disabled Biome capabilities and ESLint file overrides. Inspect configuration as data during discovery.

In a trusted project with ESLint already installed, check the effective configuration on representative files before proposing a rule change. Presets can enable the rule and narrower overrides can turn it off. Trace the normal lint or required check command through its scripts to establish whether it actually runs ESLint on those sources.

Maintain `docs/agents/code-standards.md` using the [guide template](../assets/code-standards.md). Merge with existing project rules. Replace `{{workspace_checks}}` with the actual formatter, linter, ESLint rule status, config paths, and runnable commands with their working directories. Mark unconfigured or unverified checks accurately. The root guide links here for JS/TS authoring and review.

## Ask about missing tools

Check Prettier for formatting and ESLint for linting in the actual source scope. An enabled Biome formatter or linter satisfies its respective role. Identify other tools in the project so the user can see any overlap. Share a single question for workspaces covered by the same setup.

| Verified coverage | Choices for the current gap |
| --- | --- |
| Both roles are missing | Adopt Biome, or install ESLint and Prettier |
| Linting is covered and formatting is missing | Adopt Biome, or add Prettier |
| Formatting is covered and linting is missing | Adopt Biome, or add ESLint |
| Both roles are covered | Reuse the tools and check the ESLint deprecation rule |

For a missing role, send **one** `request_user_input_async` entry with `Skip`, `Use Biome (recommended)`, and `Add {missing tools}`. Use the [approval card fields](questions.md#optional-change) for **each alternative**. Name the local dev dependencies, exact commands, working directories, manifest, lockfile, and config or script changes. Explain how overlapping responsibilities and existing project rules will be handled if Biome is selected. Include the ESLint deprecation check in either plan if it is missing. Biome can provide formatting and general linting while ESLint checks deprecated API use. [Biome setup](https://biomejs.dev/installation/quick-start/) · [ESLint setup](https://eslint.org/docs/latest/use/getting-started) · [Prettier setup](https://prettier.io/docs/install)

When both roles are covered but the ESLint check is missing from the normal lint path or ineffective, offer only the missing rule or command wiring with `Skip` and `Apply`. This includes Biome projects. Reuse existing local dependencies. Disclose any needed ESLint, TypeScript, parser or plugin installation and typed-project changes. Apply only the selected plan. A tooling selection authorizes the named setup and its verification. Source migrations require their own decision.

Use the shared question history and effective project setup before asking. Record an explicit setup skip with `kind` set to `code-standard` and the owning project-relative `package.json` as `destination`. For a tool choice use `source` = `https://biomejs.dev/installation/quick-start/` and `identity` = `missing-eslint`, `missing-prettier`, or `missing-eslint-prettier` for the current gap. For a rule-only choice use `source` = `https://typescript-eslint.io/rules/no-deprecated/` and `identity` = `@typescript-eslint/no-deprecated`. A recommendation, default selection, or unanswered card grants no approval. After adding dependencies, run the local inventory check and reuse the existing decision.

## Configure and verify the ESLint rule

Enable `"@typescript-eslint/no-deprecated": "error"` in the effective ESLint configuration for the applicable JS/TS sources. The rule uses TypeScript's symbol and overload information to report references marked `@deprecated`. Verify documentation-only deprecations against the maintainer's versioned guidance during review. Retain the project's other rules. Reuse a compatible registered plugin and typed parser configuration. If the installed version lacks the rule, include a compatible version change in the proposal. [Rule definition](https://typescript-eslint.io/rules/no-deprecated/) · [Typed lint setup](https://typescript-eslint.io/getting-started/typed-linting/)

For a new flat config, render the [ESLint template](../assets/eslint.config.mjs.tmpl) with `{{source_globs}}` replaced by a JSON array of source globs covered by the project's TypeScript configuration. With an existing config, merge into the matching block. Verify the actual JS and TS file extensions in use. If a source is outside the typed project, propose a scoped lint TSConfig and point `parserOptions.project` to it in place of `projectService`. Include `allowJs` when that TSConfig covers JavaScript. [Typed file coverage](https://typescript-eslint.io/troubleshooting/typed-linting/)

Wire the ESLint invocation into the project's normal lint command or an existing required check. If the approved setup introduces the project's first lint command, make it run every selected linter. A Biome setup must also invoke ESLint on the applicable sources through that entry point. Include the exact script change in the approval card.

After approval, use the installed ESLint from the approved workspace. Run `--print-config` for a representative file of each applicable scope and language to verify error severity. Lint actual sources without `--fix`, using JSON output to identify rule diagnostics and parser errors. Verify that the normal project check exits nonzero for a marked reference and surfaces the ESLint rule ID. Use a temporary probe in a covered source scope when no existing diagnostic exercises it, then remove the probe. Record the command, any pre-existing failures, and coverage gaps in the guide. [ESLint CLI](https://eslint.org/docs/latest/use/command-line-interface)

## Handle findings

Choose a supported API before adding a new reference. For each confirmed **pre-existing** use, group sites that share a symbol, resolved version, and migration. Match against the pre-edit code when determining whether a use is new. Present the files and lines, the evidence of deprecation, the verified replacement and its impact. Use one structured question per independent migration with `Keep existing uses` and `Migrate listed uses`. If the replacement is uncertain, ask for direction and keep those sites pending. Honor only submitted decisions. Keeping existing uses leaves the rule at error severity and the outstanding diagnostics visible.

Check existing findings during setup or a requested lint review, and the affected scope during ordinary development. A routine session-start inventory scan stays local and does not invoke ESLint. Follow the current task's normal test and lint commands after an approved migration.
