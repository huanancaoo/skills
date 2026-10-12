---
name: flutter-app-development
description: 使用 FVM、Riverpod、go_router、Dio、Freezed 和 ARB 开发 Flutter App。用于初始化新应用，或在现有应用中组织网络、状态、分页缓存、主题、国际化和本地存储的开发流程。
---

# Flutter App 开发

本插件基于 Dart and Flutter，固定技术栈为：FVM、Flutter/Dart、Riverpod、go_router、Dio、Freezed/json_serializable、Flutter ARB/gen_l10n、AdaptiveTheme、badges、gap、cached_network_image、shimmer、SharedPreferences、flutter_secure_storage，以及 flutter_test 和 build_runner。

## 先确定任务与工程

- 新工程：读取 [flutter-init-project](../flutter-init-project/SKILL.md)，确认路径、应用名、组织标识、确定的 SDK 版本、目标平台和 API 地址，再初始化。只生成基础骨架，不生成业务接口或未要求的功能。
- 现有工程：检查 `pubspec.yaml`、`pubspec.lock`、`.fvmrc`、项目指令、当前运行实例和工作区改动。现有技术栈与本插件不同且任务需要迁移时，先明确迁移范围；不自动安装第二套技术栈。
- 所有运行时与开发依赖都不预设版本，通过 Pub 按所选 SDK 解析最新可兼容版本。使用工程生成的 `pubspec.lock` 核对实际 API，不用 overrides 或人为降级来绕过解析错误。
- 工程命令使用 `fvm flutter` 和 `fvm dart`，版本来自工程 `.fvmrc`。复用现有运行实例和数据环境，不改变 FVM global。

## 按任务读取技能

| 任务 | 入口 |
| --- | --- |
| 创建完整基础栈工程 | [flutter-init-project](../flutter-init-project/SKILL.md) |
| Riverpod 与分层职责 | [flutter-apply-architecture-best-practices](../flutter-apply-architecture-best-practices/SKILL.md) |
| go_router 路由 | [flutter-setup-declarative-routing](../flutter-setup-declarative-routing/SKILL.md) |
| Dio、异步状态、错误、分页刷新、缓存 | [flutter-network-data](../flutter-network-data/SKILL.md) |
| Freezed/JSON 模型 | [flutter-implement-json-serialization](../flutter-implement-json-serialization/SKILL.md) |
| 主题、ARB 国际化 | [flutter-theme-localization](../flutter-theme-localization/SKILL.md) |
| 徽标、间距、图片加载与缓存、Shimmer | [flutter-ui-components](../flutter-ui-components/SKILL.md) |
| 偏好、敏感值、本地缓存 | [flutter-local-storage](../flutter-local-storage/SKILL.md) |
| 组件与设备测试 | [flutter-add-widget-test](../flutter-add-widget-test/SKILL.md)、[flutter-add-integration-test](../flutter-add-integration-test/SKILL.md) |
| 布局、预览、Dart 分析和其他具体任务 | 按对应名称读取本插件继承的 Dart/Flutter skill |

按本次需求创建相应层，UI、状态、Repository、Service 的职责见架构技能。接口字段、分页契约、缓存期限和错误恢复行为来自实际业务需求，缺失时先确认。

通用能力范围是网络、错误与加载状态、分页刷新、缓存、主题、国际化和本地存储。登录、推送、统计、支付、离线同步及后端搭建需要单独需求，不属于基础初始化。

## 运行与验证

初始化骨架统一使用当前独立的 `material_ui` API，所选 SDK 必须能解析这些实际依赖；不接入旧 Material 的兼容桥。

主题状态与持久化由 AdaptiveTheme 管理，Riverpod 管理业务状态与语言偏好，不另外保存一份主题模式。

新增或改动生成模型后运行 `fvm dart run build_runner build`；改动 ARB 后运行 `fvm flutter gen-l10n`。按改动范围格式化、分析并运行有意义的测试。

需要交互验证时，通过 Dart MCP 的实际工具清单发现/连接现有应用。界面和方法修改使用热重载；初始化、全局状态或 `main()` 的修改使用热重启；原生依赖和平台配置修改需要重新构建。只报告实际观察到的结果。

Dart MCP 在宿主运行环境中需要可用的 `dart`，其 SDK 应与工程的 FVM 版本一致。初始化脚本本身使用 FVM，不依赖全局 Flutter 命令。没有设备时，明确区分分析/测试通过与设备启动尚未验证；构建、测试或本地显示不证明发布完成。

当前 Dart MCP 的 `run_tests` 参数需以实际工具 schema 为准。单元与 widget 测试用明确的依赖注入配置数据源；只有真实运行 App 才读取显式环境配置，不为测试给生产代码添加缺省 API 地址。
