# Flutter App 开发

基于 Dart and Flutter 1.0.6 的私有开发插件。固定基础栈：FVM、Riverpod、go_router、Dio、Freezed/json_serializable、ARB/gen_l10n、AdaptiveTheme、badges、gap、cached_network_image、shimmer、SharedPreferences、flutter_secure_storage、环境配置和测试。

## 使用

选择插件后可直接提出：

- “初始化一个 Flutter App”：技能先确认目录、应用名、组织标识、SDK 版本、平台和 API 地址，然后执行初始化脚本。
- “给这个 App 增加分页刷新与缓存”：先明确真实 API、分页和缓存契约，再实现数据与状态链路。
- “增加主题切换和国际化”：使用持久化主题与 ARB，不改变未要求的界面设计。

初始化入口与脚本说明见 [flutter-init-project](skills/flutter-init-project/SKILL.md)。通用能力包括网络、错误/加载、分页/刷新、缓存、主题、国际化、本地存储及常用 UI 包，按需使用；基础骨架不包含登录、推送、统计、支付或后端。

## 运行前提

在有本地执行能力的 Codex 中使用。初始化需要 Python 3、FVM、可解析所选 Flutter SDK 与包依赖的网络，以及目标平台工具链。SDK 版本由每个工程选择并固定。全部运行时与开发包不预设版本，由 Pub 按该 SDK 解析最新可兼容版本，并写入工程 `pubspec.lock`。

插件沿用上游 Dart MCP 启动方式。通用安装需要宿主 `PATH` 中能找到匹配工程 FVM 版本的 `dart`；本机已在 Codex 用户配置中为同名 MCP 指定现有 SDK 的绝对路径。FVM global 不由本插件修改。保存插件到账号不会安装 SDK 或平台工具链；设备运行与发布需在实际环境分别验证。

MCP 启用官方 `cli` 与 `flutter_app_lifecycle` 工具组，可用于格式化、分析、测试、发现设备、启动应用与热重载。新建固定技术栈工程仍使用初始化技能的脚本，避免通用 create_project 只生成 Flutter 默认模板。

上游来源、复用范围与许可见 [NOTICE.md](NOTICE.md) 和 [LICENSE](LICENSE)。

包结构、实际初始化链路与 MCP 协议验证结果见 [VERIFICATION.md](VERIFICATION.md)。

主题切换与模式持久化统一由 AdaptiveTheme 负责。Riverpod/SharedPreferences 继续负责语言和其他偏好；不进行主题双写。UI 包使用入口见 [flutter-ui-components](skills/flutter-ui-components/SKILL.md)。
