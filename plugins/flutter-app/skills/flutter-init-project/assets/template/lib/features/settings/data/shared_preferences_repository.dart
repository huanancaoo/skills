import 'dart:convert';

import 'package:shared_preferences/shared_preferences.dart';

import '../domain/app_preferences.dart';
import '../domain/preferences_repository.dart';

class SharedPreferencesRepository implements PreferencesRepository {
  SharedPreferencesRepository(this._storage);

  final SharedPreferencesAsync _storage;
  static const _key = 'app.preferences';

  @override
  Future<AppPreferences> read() async {
    final encoded = await _storage.getString(_key);
    return encoded == null
        ? const AppPreferences(language: AppLanguage.system)
        : AppPreferences.fromJson(jsonDecode(encoded) as Map<String, dynamic>);
  }

  @override
  Future<void> write(AppPreferences preferences) =>
      _storage.setString(_key, jsonEncode(preferences.toJson()));
}
