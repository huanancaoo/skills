---
name: flutter-init-project
description: 用 FVM、Riverpod、go_router 和固定基础栈初始化新的 Flutter App，生成 feature-first 分层、主题与国际化骨架并执行代码生成和验证。适用于创建新工程，不用于覆盖或迁移已有工程。
---

# Flutter 项目初始化

用户已选择的固定栈是 FVM、Riverpod、go_router、Dio、Freezed/json_serializable、ARB 国际化、adaptive_theme 主题管理、SharedPreferences、flutter_secure_storage、badges、gap、cached_network_image、shimmer、显式环境配置和测试。使用 [scripts/init_project.py](scripts/init_project.py) 生成项目，而不是临时重写脚手架。

## 创建前必须明确

- 尚不存在的项目目录与 snake_case 名称。
- 反向域名组织标识；不要默认 `com.example` 或沿用其他产品标识。
- 确定的 Flutter SDK 版本；不要替换为 `stable` 或改变 FVM global。
- 目标平台集合，不自动选择全部平台。
- 已确认的 API 基础地址；不创建后端、不编造接口端点或凭据。

缺少上述信息时先澄清。可在不改变 SDK 全局状态的前提下检查 `fvm --help`、`fvm use --help` 和缓存版本。创建时可能下载指定 SDK 与依赖，应说明真实网络需求。

## 执行

从本 skill 的实际安装目录解析脚本的绝对路径，再传入用户确认的值。不要假设终端当前目录就是 skill 目录。下列是参数形状，尖括号必须替换为确认值：

```sh
python3 <本skill绝对路径>/scripts/init_project.py \
  --directory <尚不存在的绝对目录> \
  --name <snake_case名称> \
  --org <反向域名组织标识> \
  --sdk-version <确定SDK版本> \
  --platforms <android ios web macos windows linux中的已选平台> \
  --api-base-url <已确认的HTTP或HTTPS基础地址>
```

脚本固定使用参数列表调用命令：先 `fvm use VERSION --force --skip-pub-get`，再 `fvm flutter create --template app --project-name ... --org ... --platforms ... --no-pub .`，然后添加基础依赖、写入模板与 `config/development.json`，依次运行 gen-l10n、build_runner、format、analyze 与单元及 widget 测试。所有运行时和 dev 包均以不带版本的 pub add 添加，由所选 SDK 解析可兼容的最新稳定版本；保留 Pub 自动生成的 pubspec 约束与 `pubspec.lock`，不手工指定版本或写 any；不要为了解决冲突额外加入 overrides、降级或混搭替代栈。

目录已存在时直接停止。命令失败时保留工程和输出，定位失败步骤，不自动删除、重建或重试。命令没有通过时不能声称初始化完成。

## 生成结果与边界

`app/core/features` 按真实职责分层：settings 的 domain/data/presentation 仅管理语言持久化；主题状态与持久化统一由 AdaptiveTheme 负责；home 只有确有需要的 presentation。首页可进入设置，中英文 ARB 与系统/浅色/深色主题真实接通。Freezed 用于偏好模型和错误类别，仅语言的偏好模型 JSON 代码由 json_serializable 生成。

首帧前 await AdaptiveTheme.getThemeMode()，未保存时初始模式为 system；通过官方 builder 接入 MaterialApp.router，设置页调用 setLight/setDark/setSystem 并监听 modeChangeNotifier。主题 setter 同步更新界面、内部异步保存且返回 void，不报告 setter 调用结束即已保存。不要保留 Riverpod 主题状态、另存主题字段或新增旧主题字段迁移逻辑。SharedPreferencesAsync 与 Riverpod 继续管理语言；仅首次无存储值时使用 system 语言，已有语言 JSON 缺字段/null 必须失败。

Dio provider 只暴露配置好的客户端，安全存储 provider 区分敏感值与普通偏好。加载/错误组件是可组合骨架。gap 用于真实间距；badges、cached_network_image、shimmer 为默认依赖，按真实 UI 需求使用，不在初始化中虚构远程图片、业务数量或持续动画。分页、刷新、缓存按确认后的端点、分页协议和失效规则实现，不在初始化中构造假业务。登录、推送、统计、支付和后端均不属于本初始化范围。

启动命令始终显式传入 `--dart-define-from-file=config/development.json` 和目标设备。dart-define 可被提取，只能存放公开环境配置。测试通过显式 AppConfig override 验证 Dio 接线，不依赖 CLI 环境参数；生产环境仍需显式配置。真实 API、平台安全存储、签名与设备启动需单独验证，不能由 analyze 或 widget 测试推断已通过。先阅读生成项目 `README.md` 的平台说明，再按实际平台与所解析插件版本的官方文档完成设备验收。

参考：[AdaptiveTheme](https://pub.dev/packages/adaptive_theme)、[FVM 项目版本管理](https://fvm.app/documentation/guides/basic-commands)、[Flutter CLI](https://docs.flutter.dev/reference/flutter-cli)、[Riverpod](https://riverpod.dev/docs/introduction/getting_started)、[Freezed](https://pub.dev/packages/freezed)、[Flutter 国际化](https://docs.flutter.dev/ui/internationalization)。

当前主题/UI 包采用独立 material_ui，模板与测试统一从 package:material_ui/material_ui.dart 导入 Material API，并将 material_ui 作为直接依赖。AppLocalizations.delegate 与 GlobalMaterialLocalizations.delegates 接线，使用同一 Material 体系的组件本地化；不混用 SDK 旧 Material 类型或添加 CompatibilityBridge。
