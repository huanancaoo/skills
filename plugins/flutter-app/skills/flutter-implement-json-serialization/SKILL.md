---
name: flutter-implement-json-serialization
description: 使用 Freezed 与 json_serializable 为 Flutter App 建立不可变模型及 JSON 映射。用于已明确接口契约的数据模型开发。
---

# Freezed 与 JSON 契约

先确认真实接口的字段、JSON key、必填/可空语义、枚举和时间格式。缺字段和显式 null 是否等价由接口决定；不自行加入默认值让错误数据通过。

模型使用 `freezed_annotation`，声明 `.freezed.dart` 和 `.g.dart` 的 `part`，并提供生成的 `fromJson` 入口。Freezed 的工厂模型使用 `abstract class` 或 `sealed class`，按当前锁定版本核对语法。

```dart
import 'package:freezed_annotation/freezed_annotation.dart';

part 'item.freezed.dart';
part 'item.g.dart';

@freezed
abstract class Item with _$Item {
  const factory Item({required String id, required String title}) = _Item;
  factory Item.fromJson(Map<String, dynamic> json) => _$ItemFromJson(json);
}
```

只在外部 key 不同于 Dart 命名时加 `@JsonKey(name: ...)`。自定义转换器只表达确认的时间、标识或其他字段格式。Dio 已解码 JSON 的响应直接传给模型，不重复 `jsonDecode`。

执行 `fvm dart run build_runner build`，保留生成结果，不手工修改生成文件。用真实接口样例验证字段映射、可空与缺失行为及必要的序列化结果；错误样例不得被转换成空对象或成功状态。

参考 [Freezed](https://pub.dev/packages/freezed) 与 [json_serializable](https://pub.dev/packages/json_serializable) 的维护者文档。
