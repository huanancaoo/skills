# Client Question Lists

Call `request_user_input_async` with a `questions` array. Each entry has exactly `title` and `options`. Adapt human-readable text to the user's language and keep the order shown.

For formatter and linter alternatives, ESLint rule setup, and decisions about existing deprecated API uses, use the [code standards choices](code-standards.md). Each mutually exclusive toolchain is an option in the same question.

## Review timing

Use one question when the collector returns `budget.requiresDecision`.

```text
Review the {count} changed inputs with official sources now?
This review will look up guidance for the changed inputs.
```

Set `options` to `Continue current task` and `Review now`. Wait for Review now before starting that batch. Continue independent work while the choice is pending.

## Optional change

For Skills, MCP servers, and Hooks, send one `questions` entry per candidate in the same call. Populate each `title` with the following lines.

```text
Apply {kind} {identity} to this project?
Purpose — {purpose}
Workspace — {workspace}
Official source — {source}
Action — {exact_command_or_service_url_and_configuration_change}
Working directory (cwd) — {directory_for_each_command_or_stdio_launch}
Project files — {relative_destinations}
```

State the effective `cwd` for each command and STDIO launch. Label installer and server directories separately when both apply. Use `N/A` for a remote service with no local process. Include any documented workspace or configuration path arguments in Action.

Reuse the session's verified findings when the resolved version and relevant settings still match. Omit candidates satisfied by the effective project setup or covered by a matching explicit skip. Match outstanding questions by capability, source, action, each working directory, and destination, independently of translated wording or list position. Carry an unanswered entry forward even after another entry in its list was answered. A different action, working directory, or destination needs its own decision. If no new entries remain, finish the refresh without calling the question tool.

Set `options` to `Skip` and `Apply`. Only a submitted response is a decision. Apply and Skip affect their own candidate. Honor an explicit request to skip the whole list. Review timing concerns research only.
