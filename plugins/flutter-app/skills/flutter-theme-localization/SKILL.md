---
name: flutter-theme-localization
description: 使用 AdaptiveTheme 统一管理 Flutter 主题模式与持久化，使用 Riverpod 和 Flutter gen_l10n ARB 实现国际化与语言偏好。
---

# AdaptiveTheme 与 ARB 国际化

包依赖不预设版本，由 Pub 根据项目 FVM SDK 解析最新可兼容版本。核对工程 `pubspec.lock` 的实际 API；不引入第二套主题模式存储。

## 主题职责

- AdaptiveTheme 唯一拥有主题模式与其持久化，使用 light、dark、system 三种模式。Riverpod 不复制主题状态，偏好 Repository 不保存 theme 字段。
- 首帧前调用包公开的 `AdaptiveTheme.getThemeMode()` 读取模式。尚未保存时使用 system 作为初始应用契约，避免把设备跟随模式当成浅色模式。
- 在 AdaptiveTheme 的 builder 中连接 `MaterialApp.router` 的主题；Router 仍由既有 Riverpod provider 持有，不因切换主题重建导航资源。
- 设置页通过 `AdaptiveTheme.of(context)` 的公开 API 切换模式，通过其 `modeChangeNotifier` 订阅当前模式，不创建第二份本地选择状态。
- 当前公开 setter 同步更新界面，再由包异步保存；不能把 void setter 描述为已经等待持久化完成。按锁定版本使用公开 `persist()` 验证包的存储结果，不在生产路径重复保存同一份主题数据。
- `ColorScheme`、`TextTheme` 及确有用途的主题扩展表达设计语义。沿用已确认的设计，不自行增加动态主题下载或颜色持久化。

## 国际化职责

- 使用 Flutter `gen_l10n`、`flutter_localizations` 与 `intl`，初始化骨架支持设备、中英文选择。已有应用的语言范围与交互按其需求保留。
- `l10n.yaml` 决定生成路径；`MaterialApp.router` 使用 `AppLocalizations.delegate`、当前 Material 体系的 `GlobalMaterialLocalizations.delegates` 与生成的 supportedLocales，不另写一份重复语言列表，也不接入生成列表里的旧 Material 委托。
- Riverpod 与 SharedPreferencesAsync 管理语言及其他非主题偏好。仅在首次未保存时采用设备语言；已有偏好 JSON 的缺失或非法值不得被替换为成功默认数据。
- ARB 使用语义键、description、具名 placeholder 与 ICU 复数/select，避免拼接翻译片段或手写生成文件。实际新增语言由需求决定。
- 页面、错误/加载、主题和语言控件的可翻译文案来自 ARB；语言自身名称可使用其 endonym。

## 执行与验证

按本次需求读取当前 bootstrap、AdaptiveTheme、Router、语言 provider 和 ARB。涉及 ARB 时读取 [ARB 生成与验证](references/arb-generation.md)。

测试明确注入包的测试平台存储，验证三种主题模式、启动读取、切换与公开持久化、语言切换及导航状态保留。平台 mock 的行为不能证明真实平台已经持久化；实际设备重启验证单独报告。普通 SharedPreferences 的 mock 不能自动视为 SharedPreferencesAsync 的 mock，按锁定版本核对平台 API。

```sh
fvm flutter gen-l10n
fvm flutter analyze
fvm flutter test
```

参考：[AdaptiveTheme](https://pub.dev/packages/adaptive_theme)、[Flutter 国际化](https://docs.flutter.dev/ui/internationalization)、[SharedPreferences](https://pub.dev/packages/shared_preferences)。
