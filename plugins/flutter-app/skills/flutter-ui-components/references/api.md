# 组件 API 与缓存边界

需要核对调用或图片平台行为时读取。下面只展示 API 形状，不定义业务值或执行示例 HTTP 请求。本插件初始化工程统一使用 `material_ui`，示例与其保持一致；更新依赖后以 `pubspec.lock` 核对对应包源码，不能混用旧版网页示例的 Material 类型。

## 调用形状

```dart
import 'package:material_ui/material_ui.dart';
import 'package:badges/badges.dart' as badges;
import 'package:gap/gap.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:shimmer/shimmer.dart';

Widget buildMarker({
  required Widget child,
  required Widget content,
  required bool visible,
}) => badges.Badge(
  child: child,
  badgeContent: content,
  showBadge: visible,
);

Widget buildVerticalPair({
  required Widget first,
  required Widget second,
  required double spacing,
}) => Column(children: [first, Gap(spacing), second]);

Widget buildRemoteImage({
  required String imageUrl,
  required double width,
  required double height,
  required BoxFit fit,
  required Widget loading,
  required Widget failure,
}) => CachedNetworkImage(
  imageUrl: imageUrl,
  width: width,
  height: height,
  fit: fit,
  placeholder: (context, url) => loading,
  errorWidget: (context, url, error) => failure,
);

Widget buildLoadingSkeleton({
  required Widget shape,
  required Color base,
  required Color highlight,
  required Duration period,
  required bool animationsAllowed,
}) => Shimmer.fromColors(
  child: shape,
  baseColor: base,
  highlightColor: highlight,
  period: period,
  enabled: animationsAllowed,
);
```

调用方提供真实状态和设计参数；网络图片函数只有实际挂载后才会加载传入的 URL。测试应使用可控数据源，不把文档示例 URL 写进产品。

徽标参数 `position`、`onTap`、`ignorePointer` 会影响标记位置与命中区域；负偏移且有点击行为时，按真实布局验证触达范围。没有点击需求就不加入徽标操作。

Gap 的父路径必须满足包的布局要求：Flex 祖先之间不能插入改变其布局关系的 RenderObjectWidget，或使用 Scrollable 的主轴关系。组件尺寸继续由尺寸/约束 widget 表达。

Shimmer 的默认循环会持续安排动画帧；测试用明确 Duration 推进到所需帧，再切换到完成/失败状态并验证骨架不再呈现。`pumpAndSettle` 不能充当请求完成条件。

## Web 图片缓存核查

维护者 README 曾把 Web 概括为 minimal support、不含缓存。核查时继续沿实际解析版本源码确定行为，不能将这句描述扩大成所有渲染分支的结论。

当前核对的包源码中，`CachedNetworkImageProvider` 的 Web 默认是 `ImageRenderMethodForWeb.HtmlImage`：

- `HtmlImage` 路径交给 Web 图片解码 API，不调用包的 `cacheManager.getFileStream`。浏览器是否复用资源由浏览器和 HTTP 缓存语义决定，不是应用持久化保证。
- `HttpGet` 路径调用 cache manager；核对的默认 Web cache manager 使用内存文件系统与非持久化元数据。它与 IO 平台缓存目录的行为不同，不能证明页面刷新后的持久缓存。
- 不为了声称缓存而自行改成 HttpGet；所选渲染方式、跨域和 headers 必须满足实际图片来源与目标平台需求。

以后版本可能改变这些路径。依据工程 `pubspec.lock` 依次查 `cached_network_image` 的 provider 条件导入、`cached_network_image_web` 的 loader 分支和 `flutter_cache_manager` 的 Web 配置；同时按目标平台实际验证需求中的刷新/重启行为。

图片缓存属于图片资源层；Repository 数据缓存的期限、失效与离线语义继续由数据契约管理。

## 官方与维护者来源

- [badges 文档与维护者仓库入口](https://pub.dev/packages/badges)
- [Gap API 与父布局要求](https://pub.dev/documentation/gap/latest/gap/Gap-class.html)
- [CachedNetworkImage 文档](https://pub.dev/packages/cached_network_image)
- [图片 provider 源码](https://github.com/Baseflow/flutter_cached_network_image/blob/main/cached_network_image/lib/src/image_provider/cached_network_image_provider.dart)
- [Web loader 源码](https://github.com/Baseflow/flutter_cached_network_image/blob/main/cached_network_image_web/lib/cached_network_image_web.dart)
- [flutter_cache_manager 文档](https://pub.dev/packages/flutter_cache_manager)
- [Shimmer 文档](https://pub.dev/packages/shimmer)
- [WidgetTester.pump API](https://api.flutter.dev/flutter/flutter_test/WidgetTester/pump.html)
- [WidgetTester.pumpAndSettle API](https://api.flutter.dev/flutter/flutter_test/WidgetTester/pumpAndSettle.html)
