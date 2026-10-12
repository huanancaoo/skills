---
name: flutter-ui-components
description: 使用 badges、Gap、CachedNetworkImage 和 Shimmer 实现 Flutter App 已明确要求的徽标、布局间距、网络图片及骨架加载。适用于这些组件的页面实现、调整和验证。
---

# Flutter UI 组件

依赖身份固定为 `badges`、`gap`、`cached_network_image`、`shimmer`；只有具体界面需要时才使用组件，不为初始化首页制造数量、图片或加载场景。

## 依赖与实现契约

- 使用项目 FVM SDK。需要添加依赖时运行 `fvm flutter pub add badges gap cached_network_image shimmer`，不手写预设版本；由 pub 选择当前 SDK 可兼容的最新版本，以工程 `pubspec.lock` 核对实际 API、SDK 和 Material 库要求。
- 沿用工程统一的 Material API 与主题，不为组件混入兼容桥、降级版本或另一套主题体系。主题模式与持久化由已有 AdaptiveTheme 链路管理。
- 状态来自现有 Riverpod provider；View 负责组件组合。数量、显隐条件、URL、图片尺寸、骨架结构和加载/错误呈现都来自已确认需求。

## 按需实现

1. 读取目标 widget、状态模型、布局约束和主题/ARB。确认要使用哪项能力及交互语义；关键定义缺失时先澄清。
2. 在目标组件应用下列约束；需要调用形状时读取 [API 与缓存边界](references/api.md)。
3. 接入现有加载、错误和成功状态，不让 UI 装饰改变数据请求、重试、分页或缓存业务。
4. 用目标 widget 测试和实际选定平台验证布局、状态与动画；报告观察范围，不把组件渲染当作缓存持久化或真实接口验证。

### 徽标

只使用 `import 'package:badges/badges.dart' as badges;`，以 `badges.Badge`、`badges.BadgePosition` 等消除 Material 自带 Badge 的名称冲突。

徽标内容与 `showBadge` 依据真实状态；不假设零值隐藏、上限为 99 或存在未读通知业务。文案和语义描述使用既有 ARB；点击区域、位置及动画仅按需求设置。

### 间距

`Gap` 表达 Row、Column、Flex 或 Scrollable 主轴上的空隙，沿用设计间距。确保它处于支持的父布局关系中；不要把外边距 `Padding`、图片宽高、按钮尺寸或任意 `SizedBox` 机械替换为 Gap。

### 网络图片

`CachedNetworkImage` 接收已确认来源的 URL；按布局显式约束尺寸或比例，并维持图片、加载与错误区域的稳定占位。裁剪方式和替代文案由需求决定。

图片包内部的获取与缓存不经过应用 Dio provider；不能因此伪称已继承 Dio 的 headers、拦截器或环境策略。需要特殊请求头或缓存 key 时先核对需求与实际 API。

不添加演示远程 URL、不把失败替换成其他远程图片、不自行规定缓存期限或缓存清理操作。Web 的浏览器缓存、内存缓存与应用持久缓存必须区分；按锁定版本及渲染分支核对，不能保证所有平台跨刷新或重启仍有缓存。

### 骨架加载

只有需求明确要骨架时使用 `Shimmer.fromColors`。child 是与目标布局对应的简单不透明形状；形状、行数、尺寸和动画时长依据设计，颜色来自当前主题。

一个加载区域共用一个 Shimmer；请求成功或失败后退出加载呈现。通过 `enabled` 承接项目既有的减少动画约束，不另建全局动画或可访问性框架。

## 验证

- 检查徽标真实显隐、文字/语义、位置与点击区域，Gap 的主轴间距以及长文案/大字体布局。
- 图片加载、成功与失败用可控图片响应或测试数据源验证，不访问任意真实远程 URL；真实平台缓存要求另外验证，不能由 fake 测试推断。
- Shimmer 持续动画用 `tester.pump(const Duration(milliseconds: 100))` 等明确时长推进帧；加载尚未结束时不用 `pumpAndSettle` 等待永不停止的 ticker。验证状态结束后骨架消失与动画停止，以及既有减少动画约束。

```sh
fvm flutter analyze
fvm flutter test
```

维护者来源：[badges](https://pub.dev/packages/badges)、[Gap](https://pub.dev/packages/gap)、[CachedNetworkImage](https://pub.dev/packages/cached_network_image)、[Shimmer](https://pub.dev/packages/shimmer)。
