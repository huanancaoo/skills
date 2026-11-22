# Local inventory contract

The collector expects the JavaScript project root as its directory argument. Its stdout is one JSON result. It writes the project-owned `.agents/vc-project.json` only when the serialized state changes. Its workspace and package identities are independent of Git status.

## Scan result

- `status` is `unchanged`, `not-a-js-project`, `changed`, or `refresh`. An unchanged scan still reports active mismatches so they can be mentioned when relevant.
- `codeStandards` lists the owning workspaces, direct tooling dependencies, config paths (including typed projects), relevant script names, and inline manifest settings. Use these as leads to verify effective coverage. It is emitted on setup, explicit refresh, or a change to these inputs. The snapshot stores their `codeStandardsDigest` so unrelated dependency changes keep this review off the automatic work list. Known standards-only filenames remain in the configuration inventory and go through local review. The collector leaves configuration modules and lint commands unexecuted.
- `bundle` contains installed package paths, packaged guidance paths, and `inputKey` for changed local inputs. The package record reports the version these files belong to. The archive paths in a Yarn Plug'n'Play project identify the source package and path inside it. Read the relevant entry with an archive reader if needed.
- `configurationChanges` contains changed configurations with verified ownership, plus those selected by an explicit refresh. For present files, inspect their effect on commands and guides using `review.source` and applicable findings, then record outcomes with `inputKey`. A previously verified configuration that leaves the inventory is marked `removed` and identifies guidance to revisit.
- `mismatches` lists packages whose installed and lockfile resolutions differ. Treat those inputs as pending until the next scan confirms alignment.
- `research` contains publisher signals grouped by `key`. It includes potential sources and the affected inputs. Its `version` is the expected lockfile version when available. An explicit refresh returns these signals again so the agent can match them to existing verified evidence. Fetch a source only for a finding that still needs verification.
- `suppressed` contains prior lookup failures for changed inputs whose resolved versions match. Full scan results include `skipped` for all discovery paths, including bundled guidance. Compare each candidate's `kind`, canonical official `source`, `identity`, and project-relative `destination` before showing it.
- `budget.autoLimit` is five. `budget.requiresDecision` is true for a larger automatic batch. Use the output already produced to complete an authorized review. Use `--refresh` to review the current inventory again, including previously deferred or suppressed inputs.

The scanner reads root and declared workspace manifests, the active lockfile, installed direct package metadata, and installed Yarn Plug'n'Play data. Its fingerprint includes observed manifests, lockfile content, configuration signals, and installation evidence. It inspects packaged Skills and documentation locally for all direct packages when the fingerprint changes. Supported candidate config locations are each workspace root and files directly within `.config/` and `config/`. It ignores dependency trees, test fixtures, and build and cache directories as workspace candidates.

Configuration `evidence` uses `schema:` followed by the normalized HTTPS schema origin and path for schema-bearing JSON. For a named config, it uses `filename:` followed by the basename. This is an ownership clue. A verified `review` records the technology, official source, and field selectors. The `digest` tracks changes to the selected values independently of ownership. An ownership evidence change starts a new verification.

Before field selection, the collector uses a canonical digest of structured data. After review, it uses the selected values. JSON, JSONC, and recognized named YAML configurations ignore formatting and mapping key order. Scalar types, array order, and absent versus explicitly null values remain significant. Older string-only YAML digests receive one local review with their recorded ownership. For source-based configuration, the collector hashes the source and routes edits to local review once ownership is verified. Source review checks whether the edit affects commands or guidance before pursuing any missing official evidence.

The snapshot records `lockfileResolution` as the expected name and version when the active lockfile resolves the declaration. The `resolvedName` and `version` fields describe the installed copy for `installed` and `installed-mismatch` inputs, and the lockfile resolution for `lockfile-only` inputs. An `unresolved` input has no verified version.

The collector reads npm, pnpm, Yarn, and text Bun lockfiles using bundled parsers. For an existing binary Bun lockfile it uses the local Bun lockfile printer. Package inspection reads published file metadata and ZIP contents directly and leaves project loaders and application modules unloaded.

## Record outcomes

Run `node <skill-directory>/scripts/collect-inventory.mjs record <project-root> < outcomes.json` with the relevant arrays.

- `checked` accepts the `inputKey` strings of completed inputs. Complete an input after verifying its official guidance and resolving the applicable choices. The writer requires a current inventory and aligned installed and lockfile resolutions where both are available.
- `configurationReviews` accepts `inputKey`, `technology`, a credential-free official `source`, and `fields`. Use JSON Pointer strings to select settings that affect tooling, commands, or guidance, including relevant settings that are currently absent. Use `null` for a configuration reviewed as source or when the entire structured document is relevant. The writer establishes the new baseline and returns `inputKeys` mapping old keys to their replacements. Use the replacement key for later decisions. A review can be recorded separately from completion.
- `skipped` accepts records with `kind` set to `skill`, `mcp`, `hook`, or `code-standard` and the other fields defined in the schema. Use the [code standards decision identities](code-standards.md#ask-about-missing-tools) for optional lint and format setup. `unskip` removes exactly matching records when the user asks to review them again.
- `researchStatus` accepts `key`, `status`, and `reason`. Use `unreachable` for offline or failed access and `not-found` for a verified missing upstream page. Give a short reason without URL credentials or request data. The script supplies the resolved version and check time. Send successful retry keys in `clearResearch`.

The writer validates the snapshot after each change. Version 4 establishes a local code standards baseline on the first scan of a version 1, 2, or 3 snapshot. It preserves explicit skips and outcomes whose inputs still match. The earlier unversioned format retains its identifiable skip decisions. A snapshot with an unknown schema version needs explicit attention before it can be written.

## Update the root block

Use the fixed block with its code standards link. Replace `{{domain_links}}` with links to the other domains sorted by relative path. Each bullet uses `Read [title](path) when condition.` Preserve existing links and conditions for domains that did not change. Replace only the text between the two boundary markers, including the markers. Append the block once when it is absent.
