import 'package:adaptive_theme/adaptive_theme.dart';
import 'package:material_ui/material_ui.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'app/app.dart';
import 'features/settings/data/shared_preferences_repository.dart';
import 'features/settings/presentation/preferences_controller.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  final savedThemeMode = await AdaptiveTheme.getThemeMode();
  final repository = SharedPreferencesRepository(SharedPreferencesAsync());
  // 首帧前读取主题和语言，避免先显示初始值再切换到已保存偏好。
  final preferences = await repository.read();
  runApp(
    ProviderScope(
      overrides: [
        preferencesRepositoryProvider.overrideWithValue(repository),
        initialPreferencesProvider.overrideWithValue(preferences),
      ],
      child: FlutterApp(
        initialThemeMode: savedThemeMode ?? AdaptiveThemeMode.system,
      ),
    ),
  );
}
