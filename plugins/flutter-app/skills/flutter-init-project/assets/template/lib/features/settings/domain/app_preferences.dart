import 'package:freezed_annotation/freezed_annotation.dart';

part 'app_preferences.freezed.dart';
part 'app_preferences.g.dart';

enum AppLanguage { system, en, zh }

@freezed
abstract class AppPreferences with _$AppPreferences {
  const factory AppPreferences({
    @JsonKey(required: true, disallowNullValue: true)
    required AppLanguage language,
  }) = _AppPreferences;

  factory AppPreferences.fromJson(Map<String, dynamic> json) =>
      _$AppPreferencesFromJson(json);
}
