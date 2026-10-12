import 'app_preferences.dart';

abstract interface class PreferencesRepository {
  Future<AppPreferences> read();
  Future<void> write(AppPreferences preferences);
}
