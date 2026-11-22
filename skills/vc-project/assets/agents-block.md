<!-- BEGIN:vc-project -->
## Project tooling

From the repository root, run `node .agents/skills/vc-project/scripts/collect-inventory.mjs scan .` on the first turn of a session and immediately after successfully adding a direct dependency. For explicit setup or refresh, run the check with `--refresh`. Resume the task after the local check. Mention any collector error or installed/lockfile mismatch that affects the task in the task summary. For a `changed` or `refresh` result, read `.agents/skills/vc-project/SKILL.md` and use the result already collected.

Read a guide when its condition matches the current task.

{{domain_links}}
<!-- END:vc-project -->
