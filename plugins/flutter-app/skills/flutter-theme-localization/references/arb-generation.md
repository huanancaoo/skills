# ARB 生成与验证

新增消息、参数或语言时读取；按项目已确定的输出路径工作，避免复制旧版 synthetic package 导入。

## 初始化骨架

`pubspec.yaml` 启用 `flutter: generate: true`，包含 SDK 依赖 `flutter_localizations` 与 `intl`。依赖版本延续项目解析结果。

新项目可使用以下 `l10n.yaml`；已有项目保留其路径契约：

```yaml
arb-dir: lib/l10n
template-arb-file: app_zh.arb
output-localization-file: app_localizations.dart
```

此配置生成到 `lib/l10n`，应用按真实 package 名导入该目录中的 `app_localizations.dart`。不要添加已移除的 `package:flutter_gen` 导入或 synthetic-package 配置。

`app_zh.arb` 中的参数消息示例：

```json
{
  "@@locale": "zh",
  "itemsCount": "共 {count} 项",
  "@itemsCount": {
    "description": "列表当前显示的项目数量",
    "placeholders": {
      "count": {"type": "int"}
    }
  }
}
```

对应 `app_en.arb`：

```json
{
  "@@locale": "en",
  "itemsCount": "{count, plural, =0{No items} =1{1 item} other{{count} items}}"
}
```

模板定义参数类型和语义，翻译中的参数名、类型与含义保持一致。复数与 select 必须包含 `other`；别把参数值直接写进翻译键。根据实际消息需要声明数字或日期格式，不做统一格式猜测。

运行 `fvm flutter gen-l10n` 后调用生成的 `AppLocalizations.of(context)!.itemsCount(count)`。应用使用生成类的 `localizationsDelegates` 和 `supportedLocales`；若任务指定固定 locale，由应用配置传入，而非在组件内判断语言。

## 验证

- 生成器成功后再运行分析，检查 ARB JSON、缺失翻译与 ICU 语法诊断；不能用复制源语言到全部语言的方式消除缺失。
- widget 测试分别使用 zh/en locale 和生成 delegates，验证语义文案及带参数消息；复数至少覆盖 0、1、多个项目。
- 主题测试覆盖未保存的 system、已保存 light/dark、切换写入失败和最终持久化值。系统模式下模拟设备亮暗变化；实际 app 重启验证与 fake 测试分开报告。
- 检查长译文与大字体下的目标组件布局；新增语言须先得到语言范围与翻译内容的定义。

官方来源：[Flutter 国际化](https://docs.flutter.dev/ui/internationalization)、[生成代码写入源码目录的变更说明](https://docs.flutter.dev/release/breaking-changes/flutter-generate-i10n-source)。
