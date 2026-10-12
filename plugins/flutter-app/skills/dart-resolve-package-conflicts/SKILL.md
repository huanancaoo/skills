---
name: dart-resolve-package-conflicts
description: 排查 Dart/Flutter 的 Pub 依赖解析失败，并按所选 SDK 解析目标包的最新可兼容版本。用于依赖安装或明确要求的包升级。
---

# Pub 依赖解析

项目的 FVM SDK 是前提。运行时与开发包都不预设版本，不从文档复制版本号；Pub 根据 SDK 与依赖图选择最新可兼容版本，结果保留在 `pubspec.lock`。

- Flutter App 使用 `fvm flutter pub`，纯 Dart 包使用 `fvm dart pub`。
- 新增包通过不带版本的 `pub add <package>`，开发工具使用 `dev:<package>`。Pub 生成的 pubspec 约束与 lockfile 是解析结果，不由技能手工指定。
- 现有工程只在任务明确要求时升级目标依赖。用 `pub outdated` 区分 lock 当前版本、现有约束允许版本、可解析版本与最新发布版本；不把 Latest 列当成一定可用。
- 阅读解析失败输出中的完整依赖链，确定冲突来自 SDK、直接依赖还是传递依赖。关键选择尚未确定时先确认，不猜测业务允许的 SDK 或包替代。
- 不手工删改 lockfile 让解析器重新猜图，不增加 overrides、不锁定旧版、不降低 SDK，也不添加兼容桥。
- 任务要求更新目标包时，使用对应 Pub 升级命令或重新请求不带版本的目标包，由解析器更新约束与 lock。检查 diff 只包含该任务需要的依赖变化，并按实际锁定 API 修改代码。

完成后分析并运行受影响测试；记录 SDK、实际依赖解析结果与失败原因。无法解析时保留错误与工程，不声称已经安装成功。

参考 [Dart Pub 文档](https://dart.dev/tools/pub) 和目标包的维护者文档。
