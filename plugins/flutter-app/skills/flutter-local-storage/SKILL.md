---
name: flutter-local-storage
description: 使用 SharedPreferences 保存 Flutter 非敏感偏好，使用 flutter_secure_storage 保存用户指定的敏感值，并把业务缓存留在 Repository 管理。适用于偏好持久化和本地存取实现。
---

# Flutter 本地存储

只实现用户指定的存储对象、读取与清理行为；存储能力不代表要创建登录、账号或令牌业务。

## 固定契约

- 新代码使用 `shared_preferences` 的 `SharedPreferencesAsync` 保存非敏感偏好，例如语言选择；敏感值使用 `flutter_secure_storage`。
- Riverpod `Provider` 组装存储实例，普通 Service 封装明确的 key 和类型。Notifier 负责应用状态与操作，widget 不直接访问平台存储。
- 主题模式由 AdaptiveTheme 管理，不在偏好 Service 里复制或双写。业务缓存的有效期、读取策略和失效由对应 Repository 管理，不能把它与应用偏好混成全局 key-value API。
- 包安装不预设版本，由 Pub 根据所选 SDK 解析最新可兼容版本；以工程 lockfile 核对 API。所有项目命令使用 FVM；延续现有 key 和数据语义，不添加双写、兼容迁移或另一套存储库。

## 按需实现

1. 确认值的用途、敏感性、类型、key、首次未写入的语义、持久化时机及删除范围。业务缓存还需要缓存契约；缺少影响正确性的定义时先澄清。
2. 非敏感偏好调用 `SharedPreferencesAsync()` 的异步 `getString` / `setString` 等类型方法；敏感值调用 `FlutterSecureStorage` 的 `read` / `write` / `delete`。只保存真实需求中的值，不为未来登录预留字段。
3. Service 暴露语义方法，例如 `readLanguage` / `writeLanguage`，不要为只有少数偏好的项目建立通用注册表或多层存储框架。
4. `null` 表示尚未保存；首次默认值来自应用契约。无法解析的已存值与平台读取失败应暴露，不擅自当成首次使用或覆盖原值。
5. 对必须立即影响首屏的偏好，先读取成功再挂载依赖该偏好的应用状态。写入要 `await`，状态提交与写入失败的交互依据需求；不能捕获失败后声称保存成功。
6. 仅删除目标 key；全量 `clear` / `deleteAll` 需要任务明确要求其删除范围。并发写同一偏好时确保最终存值与最终有效选择一致。

## 平台边界

`SharedPreferences` 适合简单偏好，不作为关键业务事务或大容量缓存的持久化保证。遇到数据库、文件或新的存储介质需求时先确认范围，不自行新增依赖。

按实际目标平台和已解析的 `flutter_secure_storage` 版本读取官方配置要求，例如 Android SDK / backup、Apple Keychain entitlement、Web 安全上下文、Linux 系统库。只配置选定平台；不能关闭安全机制、改成明文偏好或添加生物识别流程来绕过平台错误。

敏感值不得放入 ARB、编译期环境变量、日志或异常文案。客户端 secure storage 保存用户授权写入的运行时值，不承担服务器秘密的保管。

## 验证

通过 Riverpod overrides 注入测试存储，验证首次未写入、正常读写、类型解析、读取/写入失败、目标 key 删除和多次切换的最终值。真实持久化还需在所选平台重启应用后验证；内存 fake 测试不能证明平台插件已正确配置。

```sh
fvm flutter analyze
fvm flutter test
```

## 按需查证

- [SharedPreferences 官方文档与异步 API](https://pub.dev/packages/shared_preferences)
- [SharedPreferencesAsync API](https://pub.dev/documentation/shared_preferences/latest/shared_preferences/SharedPreferencesAsync-class.html)
- [flutter_secure_storage 官方配置与平台要求](https://pub.dev/packages/flutter_secure_storage)
- [FlutterSecureStorage API](https://pub.dev/documentation/flutter_secure_storage/latest/flutter_secure_storage/FlutterSecureStorage-class.html)
