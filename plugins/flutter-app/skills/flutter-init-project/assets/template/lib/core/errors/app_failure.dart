import 'package:freezed_annotation/freezed_annotation.dart';

part 'app_failure.freezed.dart';

// 保留失败类别与原始原因，不把后端原始文案直接作为面向用户的消息。
@freezed
sealed class AppFailure with _$AppFailure implements Exception {
  const factory AppFailure.network({required Object cause}) = NetworkFailure;
  const factory AppFailure.timeout({required Object cause}) = TimeoutFailure;
  const factory AppFailure.http({
    required int statusCode,
    required Object cause,
  }) = HttpFailure;
  const factory AppFailure.cancelled({required Object cause}) =
      CancelledFailure;
  const factory AppFailure.unexpected({required Object cause}) =
      UnexpectedFailure;
}
