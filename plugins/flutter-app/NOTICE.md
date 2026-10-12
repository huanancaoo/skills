# 来源与修改

本插件基于 Dart and Flutter 1.0.6。上游来源为 https://github.com/flutter/agent-plugins ，使用本地已安装版本对应 revision `0ef3972f93e2baa4156ba1cbb1e515cd53079c68`，保留根目录 BSD-3-Clause LICENSE。

复用 24 个上游 Dart/Flutter skill 及其支持文件。架构、路由、JSON、国际化和 integration_test 指引已按本插件技术栈调整；上游的 flutter-use-http-package 由 Dio 网络技能替代。工程命令示例统一使用 FVM。新增项目初始化、开发入口、网络数据、本地存储、主题国际化技能及初始化资产。

本插件由 CAOHUANAN 维护，属于基于上游能力的自定义插件。

0.2.0 增加常用 UI 包，主题管理统一改为 AdaptiveTheme，依赖选择统一由 Pub 根据 SDK 解析最新可兼容版本。
