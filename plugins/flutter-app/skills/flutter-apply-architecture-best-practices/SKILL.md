---
name: flutter-apply-architecture-best-practices
description: 为 Flutter App 划分 UI、Riverpod 状态、Repository 和 Service 的职责。用于本插件固定技术栈下的功能实现或分层调整。
---

# Riverpod 应用分层

新工程采用 feature-first 结构：`lib/app/` 负责应用配置和 go_router，`lib/core/` 放确实共用的网络、错误、存储与主题，`lib/features/<feature>/` 放该功能的 presentation、data 与必要的 domain；presentation 包含视图与 Riverpod 状态控制器。现有工程只调整本次任务涉及的范围。

## 职责与数据流

1. `ConsumerWidget`/`ConsumerStatefulWidget` 显示状态与采集交互，`ref.watch` 订阅，事件回调用 `ref.read(provider.notifier)`。
2. 同步状态使用 `Notifier`，需要异步初始化的状态使用 `AsyncNotifier`。由状态控制器完成本次功能的加载、提交、刷新和分页协调。
3. Repository 表达业务数据契约和已确认的缓存策略；Service 使用 Dio 或平台 API 访问外部资源。
4. Riverpod `Provider` 组装依赖，普通 Repository/Service 使用构造器依赖。资源由拥有它的 provider 通过 `ref.onDispose` 释放。
5. Freezed 定义需要复制、值相等或 JSON 映射的不可变模型，json_serializable 实现序列化。生成器命令使用 `fvm dart run build_runner build`。

视图不得直接发 HTTP 请求。网络结果、业务错误和加载状态沿 `Service → Repository → Notifier → View` 传递。读取依赖用 `ref.watch` 时，要确认依赖变化导致的状态重建符合需求。

## 保持层的实际用途

只创建有具体职责的类和目录。首页骨架不需要空 Service、空 Repository 或空 Use Case。Domain/Use Case 仅用于复杂或跨功能复用的业务逻辑。Riverpod 负责依赖组装，不引入另一套 DI 容器。主题模式与持久化统一由 AdaptiveTheme 管理，Riverpod 与偏好仓储只管理语言和其他状态，不另存一份主题模式。

分页、缓存、重试和错误后保留旧数据是业务行为，不由分层自动决定；读取 [flutter-network-data](../flutter-network-data/SKILL.md) 后明确接口契约与预期交互。

用 provider overrides 或普通依赖注入验证业务与状态，用 widget 测试验证显示和操作。运行 `fvm flutter analyze` 与相关 `fvm flutter test`；设备验证应单独记录。
