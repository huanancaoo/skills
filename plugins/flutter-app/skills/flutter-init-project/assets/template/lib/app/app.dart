import 'package:adaptive_theme/adaptive_theme.dart';
import 'package:material_ui/material_ui.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../features/settings/domain/app_preferences.dart';
import '../features/settings/presentation/preferences_controller.dart';
import '../l10n/app_localizations.dart';
import 'router.dart';

class FlutterApp extends ConsumerWidget {
  const FlutterApp({required this.initialThemeMode, super.key});

  final AdaptiveThemeMode initialThemeMode;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final preferences = ref.watch(preferencesControllerProvider);
    return AdaptiveTheme(
      light: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.blue),
      ),
      dark: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: Colors.blue,
          brightness: Brightness.dark,
        ),
      ),
      initial: initialThemeMode,
      builder: (theme, darkTheme) => MaterialApp.router(
        onGenerateTitle: (context) => AppLocalizations.of(context).appTitle,
        theme: theme,
        darkTheme: darkTheme,
        locale: switch (preferences.language) {
          AppLanguage.system => null,
          AppLanguage.en => const Locale('en'),
          AppLanguage.zh => const Locale('zh'),
        },
        localizationsDelegates: [
          AppLocalizations.delegate,
          ...GlobalMaterialLocalizations.delegates,
        ],
        supportedLocales: AppLocalizations.supportedLocales,
        routerConfig: ref.watch(routerProvider),
      ),
    );
  }
}
