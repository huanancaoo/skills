<!-- BEGIN:vc-project -->
## Project tooling

From the repository root, run `node .agents/skills/vc-project/scripts/collect-inventory.mjs scan .` on the first turn of a session and immediately after successfully adding a direct dependency. For explicit setup or refresh, run the check with `--refresh`. Resume the task after the local check. Mention any collector error or installed/lockfile mismatch that affects the task in the task summary. For a `changed` or `refresh` result, read `.agents/skills/vc-project/SKILL.md` and use the result already collected.

If no UI guide is listed below, follow [Maintain project guides](.agents/skills/vc-project/SKILL.md#maintain-project-guides) to register and read one on the first task implementing or reviewing a user-facing page or component.

Read a guide when its condition matches the current task.

- Read [Code standards](docs/agents/code-standards.md) when writing or reviewing JS/TS code, handling deprecated APIs, or changing formatter and lint configuration.
{{domain_links}}
<!-- END:vc-project -->
