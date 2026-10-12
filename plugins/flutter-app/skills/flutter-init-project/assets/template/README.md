# __PROJECT_NAME__

固定栈：FVM、Flutter、Riverpod、go_router、Dio、Freezed/json_serializable、ARB 国际化、SharedPreferences、flutter_secure_storage、badges、gap、cached_network_image、adaptive_theme、shimmer。

初始化通过不带版本参数的 pub add 解析所选 SDK 可兼容的最新稳定包，并生成 pubspec 约束和 lockfile；不手工指定包版本、使用 any 或 overrides。`pubspec.lock` 固定本次解析的依赖版本，`.fvmrc` 固定 Flutter SDK。将两者提交到版本库；包版本升级应单独验证。

## 启动与验证

```sh
fvm flutter run --dart-define-from-file=config/development.json -d <设备 ID>
fvm flutter gen-l10n
fvm dart run build_runner build
fvm dart format lib test
fvm flutter analyze
fvm flutter test
```

`config/development.json` 仅保存 `API_BASE_URL`。dart-define 会被编译进客户端，不能存放密钥。其他环境创建独立 JSON 并明确选择，不根据构建模式猜测环境。

## 目录职责

- `lib/app`：应用组合、路由、AdaptiveTheme 和本地化接线。
- `lib/core/config`：显式环境配置；`network`：已配置的 Dio；`errors`：基础错误类别与 Dio 映射。
- `lib/core/storage`：平台安全存储 provider；`presentation`：AsyncValue 的加载和错误展示。
- `lib/features/settings/domain`：仅语言的偏好模型及仓储契约；`data`：语言偏好的 JSON 持久化；`presentation`：Riverpod 语言控制器与设置页。主题状态与存储由 AdaptiveTheme 负责。
- `lib/features/home/presentation`：最小入口。没有业务数据的首页不创建空的 domain/data 层。
- `lib/l10n`：中英文 ARB 和生成的本地化源文件。
- `test`：路由、主题切换和语言切换的 widget 测试；以测试仓储替换平台存储。单元测试验证错误原因保留、偏好 JSON 的严格字段契约及环境配置到 Dio 的接线。

主题和语言在首帧前读取，新安装均跟随系统。`AdaptiveTheme.getThemeMode()` 返回的模式传给根 AdaptiveTheme；主题只通过该包的 setLight/setDark/setSystem 切换，设置页监听 modeChangeNotifier。setter 同步更新界面并内部发起异步保存，返回 void，不能把调用结束当作持久化完成。生产代码不额外重复保存同一模式。

Riverpod 控制器只管理语言，并在 SharedPreferencesAsync 写入成功后更新语言状态。app.preferences JSON 仅保存必填 language 字段；已有 JSON 缺字段或字段为 null 时拒绝解析，不重置，也不新增旧主题字段迁移或双写逻辑。主题的读写语义由 AdaptiveTheme 公开 API 管理，不复制它的存储键或内部格式到生产代码。

测试通过包公开的 InMemorySharedPreferencesAsync 平台初始化内存数据，保留真实 AdaptiveTheme 和语言仓储行为。dev 依赖 shared_preferences_platform_interface 仅用于此测试。Dio 单元测试显式注入测试 AppConfig，因此不依赖命令行 dart-define；生产网络配置仍必须来自明确的环境参数。

## 继续开发

新增功能沿 `features/<feature>/{domain,data,presentation}` 放置实际需要的层。分页、刷新和缓存的业务契约尚未给定，初始化不发起请求、不构造假列表、不猜测端点、分页协议或缓存失效规则。确认契约后按相应能力 skill 实现。

普通偏好使用 SharedPreferencesAsync，敏感值使用安全存储。安全存储、真实 API 和设备启动需在目标平台单独验收；widget 测试不能证明这些平台能力已可用。

Android 安全存储需满足所解析版本的最低 SDK。Apple 平台需按安全存储的官方说明配置 Keychain 与签名；Linux 需安装该插件要求的系统库；Web 需 HTTPS 或 localhost。平台配置属于真实构建与启动环节，以当前锁定插件版本官方文档为准，不通过降低安全要求跳过。

badges、cached_network_image 和 shimmer 作为默认依赖供真实需求按需使用；骨架不虚构业务数量、远程图片 URL 或持续动画来展示组件。gap 用于设置页真实布局间距。

参考：[AdaptiveTheme](https://pub.dev/packages/adaptive_theme)、[Flutter 国际化](https://docs.flutter.dev/ui/internationalization)、[SharedPreferences](https://pub.dev/packages/shared_preferences)、[安全存储的平台说明](https://pub.dev/packages/flutter_secure_storage)。

当前主题/UI 包采用独立 material_ui，模板与测试统一从 package:material_ui/material_ui.dart 导入 Material API，并将 material_ui 作为直接依赖。AppLocalizations.delegate 与 GlobalMaterialLocalizations.delegates 接线，使用同一 Material 体系的组件本地化；不混用 SDK 旧 Material 类型或添加 CompatibilityBridge。
