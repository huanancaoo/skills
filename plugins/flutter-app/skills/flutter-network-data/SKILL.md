---
name: flutter-network-data
description: 在 FVM、Riverpod、Dio、Freezed 与 json_serializable 技术栈中实现 Flutter 网络数据、请求错误、加载状态、分页刷新和 Repository 缓存。适用于已有接口契约的客户端数据流程。
---

# Flutter 网络与数据

实现用户指定的数据流程；本技能不定义后端接口，也不创建登录、推送、统计或支付业务。

## 固定契约

- 使用项目的 FVM SDK；依赖安装、代码生成、分析与测试均通过 `fvm flutter` 或 `fvm dart`。
- 数据链路为 `Dio provider → Service → Repository → AsyncNotifier → ConsumerWidget`。Riverpod 负责依赖组装，不加入第二套 DI 容器。
- Service 使用 Dio 发送请求并解析传输模型；Repository 暴露应用需要的模型并管理业务缓存；AsyncNotifier 管理页面状态和用户操作；View 只渲染状态与派发事件。
- 接口模型与复杂不可变页面状态使用 Freezed；JSON 映射使用 json_serializable。简单的标量状态无需人为包装成模型。
- `Dio` 的 base URL 取自项目环境配置。接口路径、HTTP 方法、请求字段、超时和成功判定依据已有契约，不能自行猜测。

## 按需实现

1. 读取目标 feature、环境配置、现有 providers 和接口契约。确认响应结构、必填与可空字段、业务错误以及加载交互；缺少影响实现的定义时先澄清。
2. 用 Riverpod `Provider` 组装 Dio、Service 和 Repository。Dio 生命周期由创建它的 provider 管理，通过 `ref.onDispose(() => dio.close())` 释放；不要在 widget `build` 中创建客户端或启动请求。
3. 按真实 schema 建立模型。涉及生成时读取 [模型生成](references/model-generation.md)，运行生成器后再分析依赖生成代码的源码。
4. 用 `AsyncNotifier` 的 `build` 执行初始异步加载，公开方法实现用户已要求的操作。Widget 用 `ref.watch` 获取状态，在事件回调用 `ref.read(provider.notifier)` 调用方法。
5. 页面区分初始加载、成功空数据、成功有数据和错误；`AsyncValue` 是异步请求状态的来源。刷新或加载下一页需要独立状态时仅加入对应字段，避免与 `AsyncValue` 重复表达初始加载。
6. 只有任务要求分页、刷新或缓存时读取 [分页、竞态与缓存](references/pagination-cache.md) 并实现相应行为。

## 错误与行为边界

- 请求错误保留 `DioException` 的类别、HTTP 状态与原始原因；业务错误仅按服务器已定义的响应协议识别，不能假设 `code == 0` 或把所有 HTTP 200 当业务成功。
- JSON 解析失败是契约或数据错误，不转换成空列表、缺省成功模型或缓存命中。
- 将失败与 stack trace 暴露给异步状态；用户文案用 ARB 的语义键映射已定义错误，不能直接显示服务器原始异常或请求内容。
- 替换请求导致的取消不显示为本轮业务失败；真正属于当前请求的错误仍需呈现。取消不能代替过期响应判定。
- Riverpod 当前会自动重试失败的 provider computation。网络 `AsyncNotifierProvider` 显式设置 `retry: (retryCount, error) => null`，或承接项目已明确关闭重试的作用域配置，才能保持一次触发一次请求的契约。
- 不添加 Dio 自动重试、离线读取、认证拦截器或错误吞没。用户是否可手动重试、刷新失败是否保留旧内容，由交互需求决定。

## 验证

按本次改动涉及的职责运行模型、响应解析、Repository 或 provider/widget 测试；利用 Riverpod overrides 注入可控数据源，无需连接未授权的真实后端。验证请求成功、请求失败、业务失败、空数据、初始加载及失败不会自行再次请求；实现分页或缓存时补充其状态与时序测试。

```sh
fvm dart run build_runner build
fvm flutter analyze
fvm flutter test
```

报告哪些状态经过单元或 widget 验证，哪些经过设备交互验证；分析通过不能证明真实接口或应用交互已成功。

## 按需查证

- [Dio 官方文档：配置、DioException 与取消](https://pub.dev/packages/dio)
- [Riverpod AsyncNotifier API](https://pub.dev/documentation/flutter_riverpod/latest/flutter_riverpod/AsyncNotifier-class.html)
- [Riverpod Refs：watch、read 与生命周期](https://riverpod.dev/docs/concepts2/refs)
- [Riverpod 自动重试与关闭方式](https://riverpod.dev/docs/concepts2/retry)
- [Riverpod 测试](https://riverpod.dev/docs/how_to/testing)
