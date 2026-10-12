import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:json_annotation/json_annotation.dart';
import 'package:__PROJECT_NAME__/core/config/app_config.dart';
import 'package:__PROJECT_NAME__/core/errors/app_failure.dart';
import 'package:__PROJECT_NAME__/core/errors/dio_failure.dart';
import 'package:__PROJECT_NAME__/core/network/dio_provider.dart';
import 'package:__PROJECT_NAME__/features/settings/domain/app_preferences.dart';

void main() {
  test('Dio 失败保留原始原因，分类不丢失诊断上下文', () {
    final error = DioException(
      requestOptions: RequestOptions(path: '/'),
      type: DioExceptionType.connectionError,
      error: StateError('connection failed'),
    );
    final failure = failureFromDio(error);
    expect(failure, isA<NetworkFailure>());
    expect(identical(failure.cause, error), isTrue);
  });

  test('HTTP 失败保留状态码和原始原因', () {
    final request = RequestOptions(path: '/');
    final error = DioException(
      requestOptions: request,
      type: DioExceptionType.badResponse,
      response: Response<dynamic>(requestOptions: request, statusCode: 503),
    );
    final failure = failureFromDio(error) as HttpFailure;
    expect(failure.statusCode, 503);
    expect(identical(failure.cause, error), isTrue);
  });

  test('已有偏好缺字段时拒绝解析，不重置为系统设置', () {
    expect(
      () => AppPreferences.fromJson({}),
      throwsA(isA<MissingRequiredKeysException>()),
    );
  });

  test('已有偏好字段为 null 时拒绝解析，不重置为系统设置', () {
    expect(
      () => AppPreferences.fromJson({'language': null}),
      throwsA(isA<DisallowedNullValueException>()),
    );
  });

  test('显式环境配置接通 Dio provider，构造阶段仅提供客户端', () {
    const config = AppConfig(apiBaseUrl: 'https://api.validation.test');
    final container = ProviderContainer(
      overrides: [appConfigProvider.overrideWithValue(config)],
    );
    addTearDown(container.dispose);
    final dio = container.read(dioProvider);
    expect(container.read(appConfigProvider), same(config));
    expect(dio.options.baseUrl, config.apiBaseUrl);
    expect(container.read(dioProvider), same(dio));
  });
}
