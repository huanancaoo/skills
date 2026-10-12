---
name: flutter-add-integration-test
description: 使用 Flutter integration_test 在真实设备或模拟器验证 App 用户流程，并把有价值的交互检查保存为集成测试。
---

# Flutter 设备集成测试

先确认要验证的用户流程、运行设备、API 环境和允许的数据副作用。复用已存在的工程、设备和环境；测试数据必须来自已授权的测试场景。

1. 在 `dev_dependencies` 中添加 Flutter SDK 的 `integration_test`，保留 SDK 的 `flutter_test`。
2. 在 `integration_test/<flow>_test.dart` 中调用 `IntegrationTestWidgetsFlutterBinding.ensureInitialized()`，通过应用真实 `main()` 完成启动；等待启动状态后再操作。
3. 使用稳定、确有用途的 Key 或界面语义定位，编写 `WidgetTester` 操作与可观察断言。加载状态等待应有明确结束条件。
4. 在已确认设备运行：`fvm flutter test integration_test/<flow>_test.dart -d <device-id> --dart-define-from-file=<environment-file>`。环境文件来自该工程，不复制开发占位地址作为真实后端。

Web 集成测试使用 `integration_test` 的 host driver 与当前 Flutter 官方执行方式，在需要 Web 验证时读取 [官方集成测试文档](https://docs.flutter.dev/testing/integration-tests)。

Dart MCP 可用于发现当前运行 App、检查 widget tree 与验证交互，但只调用实际工具清单提供的工具。MCP 观察和永久集成测试是两种证据，报告各自实际完成的范围。

普通 integration_test 不向生产 `main()` 注入 Flutter Driver extension。分析、widget 测试、设备集成与真实后端完成情况分别报告；失败时修复根因，不通过弱化断言制造通过结果。
