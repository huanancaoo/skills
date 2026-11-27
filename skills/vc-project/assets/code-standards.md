# Code standards

## Project checks

{{workspace_checks}}

## Code quality metrics

Use these thresholds to guide JS/TS development and review. The project's configured checks determine which limits are enforced.

| Metric | What it measures | Recommended threshold | Risk |
| --- | --- | --- | --- |
| Cyclomatic complexity | Number of linearly independent execution paths through a function | ≤10 per function | More paths make the logic harder to test and maintain. |
| Code duplication | Duplicated source lines as a percentage of all source lines analyzed across the project | <3% | Copying code spreads defects, and later fixes can miss individual copies. |
| Unit test coverage | Percentage of a core module's executable lines or branches exercised by unit tests | ≥80% in core modules | Low coverage makes refactoring riskier and raises the cost of regression testing. |
| Function and file length | Lines of code in a single function or source file | ≤50 lines per function and ≤500 lines per file | Long functions and files can mix responsibilities and take longer to understand. |
| Technical debt ratio | Estimated time to fix all detected code smells divided by the estimated development time for the same code | ≤5% (A on SonarQube's default maintainability scale) | Accumulated debt slows the delivery of future changes. |

- When complexity exceeds the threshold, trace the branches and identify any paths that are hard to follow or test. For a long function or file, look for distinct responsibilities before proposing a split.
- Use the overall project result for duplication. SonarQube's default gate checks duplication (≤3%) and coverage (≥80%) on new code. [SonarQube quality gates](https://docs.sonarsource.com/sonarqube-server/quality-standards-administration/managing-quality-gates/introduction-to-quality-gates#sonar-way-recommended-quality-gate)
- When reporting coverage, name the core module and specify line or branch coverage. Check that tests assert the expected outcomes on critical failure paths, even when coverage meets the target.
- Compare debt ratios over time within the same project using a consistent analysis scope, rule set, and cost model. [SonarQube maintainability metrics](https://docs.sonarsource.com/sonarqube-server/user-guide/code-metrics/metrics-definition#maintainability)

## Deprecated APIs

Use supported APIs for new code. The project policy is `@typescript-eslint/no-deprecated` at `error` for typed JS and TS sources. Run it through the normal project lint command once configured. Check the resolved dependency's declarations and maintainer guidance when choosing a replacement. Flag any gaps in coverage.

When an existing call uses a deprecated API, identify the symbol, affected files and lines, and the supported replacement for this project version. Ask through the client's structured Question List whether to migrate those specific uses. Keep the code as written until the user approves that migration. Reuse the original question for unresolved sites in the same conversation.
