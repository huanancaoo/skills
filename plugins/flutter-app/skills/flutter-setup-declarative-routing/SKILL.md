---
name: flutter-setup-declarative-routing
description: 在现有 Flutter App 中使用 go_router 与 Riverpod 配置路由、导航和明确要求的深链或嵌套导航。
---

# go_router 路由

新建工程先用 [flutter-init-project](../flutter-init-project/SKILL.md)。本技能只处理已存在工程的路由需求，命令使用 `fvm flutter`。

基础路由由 Riverpod `Provider<GoRouter>` 持有，通过 `MaterialApp.router(routerConfig: ref.watch(appRouterProvider))` 连接。创建 router 的 provider 注册 `ref.onDispose(router.dispose)`，使资源与应用作用域一致。

```dart
final appRouterProvider = Provider<GoRouter>((ref) {
  final router = GoRouter(
    routes: [
      GoRoute(path: '/', builder: (context, state) => const HomeScreen()),
    ],
  );
  // 应用作用域拥有路由资源，销毁时一起释放。
  ref.onDispose(router.dispose);
  return router;
});
```

## 根据需求扩展

- 定义路径、参数、页面和返回行为，使用 `context.go`、`context.push`、`context.pop` 表达确认的导航语义。
- 需要独立导航栈的底部标签时使用 `StatefulShellRoute.indexedStack`，明确再次点击当前标签时是否回到首页。
- 只有明确的深链需求才配置 Android intent filter/assetlinks、iOS associated domains/AASA；域名、应用标识与签名来自实际项目。
- 只有明确的 Web 路径 URL 需求才配置 URL strategy，并检查托管端路径重写。
- 重定向只来自已确认的业务状态。不要为了基础路由创建登录页或认证流程。

用 widget 测试验证路由目的地与返回行为。深链需在对应平台实际打开目标 URL 并观察路由；仅存在路由配置不足以证明平台深链有效。

参考 [go_router 官方文档](https://pub.dev/documentation/go_router/latest/)；读取与当前需求相关的主题，并核对锁定版本的 API。
