---
name: flutter-setup-localization
description: 为固定技术栈 Flutter App 配置 ARB 与 gen_l10n，连接 MaterialApp.router 的本地化委托与支持语言。
---

# ARB 国际化配置

新工程由 [flutter-init-project](../flutter-init-project/SKILL.md) 初始化中英文 ARB 与生成配置。已有工程先检查现有语言范围与 `l10n.yaml`，配置使用 Flutter gen_l10n，不引入另一套国际化实现。

1. 通过 `fvm flutter pub add` 添加 SDK 的 `flutter_localizations` 和可被当前 SDK 解析的 `intl`，保留项目 lockfile。`pubspec.yaml` 的 `flutter` 区域启用 `generate: true`。
2. 在 `l10n.yaml` 指定 ARB 目录、模板文件、生成文件名与项目内的输出目录。生成源码位于工程 `lib/` 下；不使用 synthetic-package 或 package:flutter_gen 路径。
3. 向 `MaterialApp.router` 提供生成的 `AppLocalizations.delegate`、当前 Material 体系的 `GlobalMaterialLocalizations.delegates` 与 `AppLocalizations.supportedLocales`；导入路径按该工程输出目录确定，避免混用旧 Material 委托。
4. 用 ARB 语义键、description、具名占位和 ICU 复数表达消息，运行 `fvm flutter gen-l10n`。
5. 验证选定语言的消息、参数及界面显示；支持语言与用户要求一致，不因初始化模板增加或删除业务语言。

持久化主题、语言选择及消息维护的完整流程见 [flutter-theme-localization](../flutter-theme-localization/SKILL.md) 与其 ARB 引用。语言选择交互由当前任务决定，保持已存在的选择行为。

参考 [Flutter 官方国际化文档](https://docs.flutter.dev/ui/internationalization)，按工程锁定 SDK 查证实际生成配置。
