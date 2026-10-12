import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../domain/app_preferences.dart';
import '../domain/preferences_repository.dart';

final preferencesRepositoryProvider = Provider<PreferencesRepository>((ref) {
  throw StateError('Bootstrap must supply the preferences repository.');
});
final initialPreferencesProvider = Provider<AppPreferences>((ref) {
  throw StateError('Bootstrap must supply loaded preferences.');
});
final preferencesControllerProvider =
    NotifierProvider<PreferencesController, AppPreferences>(
      PreferencesController.new,
    );

class PreferencesController extends Notifier<AppPreferences> {
  @override
  AppPreferences build() => ref.watch(initialPreferencesProvider);

  Future<void> setLanguage(AppLanguage language) =>
      _save(state.copyWith(language: language));

  Future<void> _save(AppPreferences preferences) async {
    // 语言保存成功后再发布新状态；主题状态与保存均由 AdaptiveTheme 独立管理。
    await ref.read(preferencesRepositoryProvider).write(preferences);
    state = preferences;
  }
}
