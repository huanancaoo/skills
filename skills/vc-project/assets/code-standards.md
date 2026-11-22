# Code standards

## Project checks

{{workspace_checks}}

## Deprecated APIs

Use supported APIs for new code. The project policy is `@typescript-eslint/no-deprecated` at `error` for typed JS and TS sources. Run it through the normal project lint command once configured. Check the resolved dependency's declarations and maintainer guidance when choosing a replacement. Flag any gaps in coverage.

When an existing call uses a deprecated API, identify the symbol, affected files and lines, and the supported replacement for this project version. Ask through the client's structured Question List whether to migrate those specific uses. Keep the code as written until the user approves that migration. Reuse the original question for unresolved sites in the same conversation.
