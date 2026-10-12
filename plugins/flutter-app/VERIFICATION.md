# 验证记录

日期：2026-10-12。插件版本：0.2.0。

## 包与依赖

根清单使用 Agent Plugins 1.0；包含 30 个技能，技能格式、名称、本地引用与图标经过校验。插件保持原私有个人身份和 MCP 声明。

全部运行时与开发包由不带版本的 Pub 命令添加，按所选 SDK 解析最新可兼容稳定版本。Pub 自动生成工程 pubspec 约束及 lockfile；包版本不是初始化脚本的预设值。

## 全新初始化实际执行

Flutter 3.47.0 / Dart 3.13.0，Web 平台。FVM 固定 SDK、Flutter create、依赖解析、模板安装、gen-l10n、Freezed/JSON build_runner、format、analyze 和测试整条链路成功。最终模板逐文件与验证工程一致，仅替换包名。

静态分析：No issues found。测试：9/9 通过（4 widget + 5 core），不需要 dart-define。验证路由进入与返回、AdaptiveTheme 模式切换/持久化/重建读取、语言切换与独立存储、错误原始原因、语言必填/null 契约及显式配置到 Dio provider 的接线。

本次实际依赖解析快照：badges 4.0.1、gap 3.0.1、cached_network_image 4.0.4、adaptive_theme 3.8.0、shimmer 4.0.0、material_ui 1.6.0。这些是本次 lockfile 的结果，不是预设版本约束。

主题/UI/测试统一使用 material_ui 的正式 API 与本地化委托。AdaptiveTheme 唯一管理主题模式与存储，Riverpod 和 SharedPreferencesAsync 管理语言；没有兼容桥或主题双写。

验证工程：`/private/tmp/flutter_plugin_stack_0_2_20261012_validation`。完整日志：`/private/tmp/flutter-plugin-stack-0.2-validation-20261012.log`。

## 当前 Codex 本机配置

插件技能已通过账号管理的安装目录加载。本机使用官方 `codex mcp add` 注册同名 `dart-mcp-server`，command 指向 `/Users/huanancao/fvm/versions/3.47.0/bin/dart`，启用 `cli` 与 `flutter_app_lifecycle`，环境包含 `AGENT_PLUGIN=codex`。`codex mcp get --json` 已确认有效配置。

宿主日志证实之前 bare dart 无法启动，并有两个插件注册同名 MCP；顶层配置使本机使用明确的 SDK 和工具组，未改 FVM global、安装缓存或账号内可移植 MCP 声明。

使用该有效配置实际启动官方 Dart MCP 1.2.0，发现 23 个工具，新工程 roots.add 成功，analyze_files 返回 No errors，run_tests 返回 9/9 All tests passed。验证进程已退出。日志 `/private/tmp/flutter_plugin_0_2_mcp_smoke.jsonl`，摘要 `/private/tmp/flutter_plugin_0_2_mcp_smoke.summary.md`。

此前旧工程的一项测试依赖编译期 API_BASE_URL，MCP 工具不支持 dart-define 参数，真实测试结果为 7/8。新版测试改为显式依赖注入，生产 API 配置仍是必需参数；旧失败记录保留，没有增加生产默认地址。

本机配置需由宿主加载后才能在聊天内使用。用户本轮选择暂不重载，因此不把独立进程验证当作当前聊天已连接。

## 证据边界

未启动实际设备或浏览器 App，未调用真实 API，未验证原生存储、签名或发布。图片资源缓存与 Repository 业务缓存独立；Web 图片缓存不承诺跨刷新或重启持久保存。分页/缓存策略按对应技能和实际业务契约实施。
