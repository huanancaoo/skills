import 'package:dio/dio.dart';

import 'app_failure.dart';

AppFailure failureFromDio(DioException error) => switch (error.type) {
  DioExceptionType.connectionTimeout ||
  DioExceptionType.sendTimeout ||
  DioExceptionType.receiveTimeout => AppFailure.timeout(cause: error),
  DioExceptionType.connectionError => AppFailure.network(cause: error),
  DioExceptionType.cancel => AppFailure.cancelled(cause: error),
  // 无状态码的异常不伪造 HTTP 状态；未知错误保留独立类别。
  DioExceptionType.badResponse when error.response?.statusCode != null =>
    AppFailure.http(statusCode: error.response!.statusCode!, cause: error),
  _ => AppFailure.unexpected(cause: error),
};
