# Freezed 与 JSON 生成

需要接口模型或复杂不可变状态时读取。本项目固定使用 Freezed，不引入另一套模型框架。

运行时依赖为 `freezed_annotation`、`json_annotation`；开发依赖为 `freezed`、`json_serializable`、`build_runner`。沿用初始化阶段已经解析的版本和 lockfile，不能为了复制文档示例无关升级 SDK 或依赖。

下面仅说明生成结构，实际字段与类型必须来自接口 schema：

```dart
import 'package:freezed_annotation/freezed_annotation.dart';

part 'list_entry.freezed.dart';
part 'list_entry.g.dart';

@freezed
abstract class ListEntry with _$ListEntry {
  const factory ListEntry({
    required String id,
    required String label,
  }) = _ListEntry;

  factory ListEntry.fromJson(Map<String, dynamic> json) =>
      _$ListEntryFromJson(json);
}
```

- 单构造器数据类使用当前 Freezed 的 `abstract class` 写法；多分支状态可以使用 `sealed class`，不要因此改变后端 JSON 结构。
- `fromJson` 使用箭头工厂以触发 JSON 生成，声明 `.freezed.dart` 和 `.g.dart` 两个 part。纯页面状态不需要 JSON 时只声明 Freezed part。
- `required`、可空性、JSON 字段名和默认值对应真实数据契约。不能用 `@Default` 掩盖服务器缺失的必填字段；嵌套序列化按实际模型需要配置。
- Freezed 集合保持不可变，更新使用新列表与 `copyWith`，不能修改状态中的原列表。
- 不手改生成文件。使用 `fvm dart run build_runner build`，完成后用 `fvm flutter analyze` 与序列化测试验证。
- 测试典型输入的 `fromJson`、输出字段的 `toJson` 和契约允许的 null；非法必填字段应真实失败，不用空模型吸收。

官方来源：[Freezed](https://pub.dev/packages/freezed)、[json_serializable](https://pub.dev/packages/json_serializable)、[build_runner](https://pub.dev/packages/build_runner)。
