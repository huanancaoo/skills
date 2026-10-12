import 'package:adaptive_theme/adaptive_theme.dart';
import 'package:material_ui/material_ui.dart';
import 'package:gap/gap.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../l10n/app_localizations.dart';
import '../domain/app_preferences.dart';
import 'preferences_controller.dart';

class SettingsPage extends ConsumerStatefulWidget {
  const SettingsPage({super.key});

  @override
  ConsumerState<SettingsPage> createState() => _SettingsPageState();
}

class _SettingsPageState extends ConsumerState<SettingsPage> {
  bool _savingLanguage = false;

  Future<void> _saveLanguage(Future<void> Function() action) async {
    setState(() => _savingLanguage = true);
    try {
      await action();
    } catch (error) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(AppLocalizations.of(context).operationFailed)),
        );
      }
    } finally {
      if (mounted) setState(() => _savingLanguage = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final preferences = ref.watch(preferencesControllerProvider);
    final controller = ref.read(preferencesControllerProvider.notifier);
    final adaptiveTheme = AdaptiveTheme.of(context);
    final l10n = AppLocalizations.of(context);
    return Scaffold(
      appBar: AppBar(title: Text(l10n.settings)),
      body: ListView(
        padding: const EdgeInsets.all(24),
        children: [
          Text(l10n.theme, style: Theme.of(context).textTheme.titleMedium),
          const Gap(8),
          ValueListenableBuilder<AdaptiveThemeMode>(
            valueListenable: adaptiveTheme.modeChangeNotifier,
            builder: (context, mode, child) =>
                SegmentedButton<AdaptiveThemeMode>(
                  key: const ValueKey('theme-selector'),
                  segments: [
                    ButtonSegment(
                      value: AdaptiveThemeMode.system,
                      label: Text(l10n.system),
                    ),
                    ButtonSegment(
                      value: AdaptiveThemeMode.light,
                      label: Text(l10n.light),
                    ),
                    ButtonSegment(
                      value: AdaptiveThemeMode.dark,
                      label: Text(l10n.dark),
                    ),
                  ],
                  selected: {mode},
                  onSelectionChanged: (value) {
                    // setter 立即更新界面，包内部异步保存；这里不宣称保存已经完成。
                    switch (value.single) {
                      case AdaptiveThemeMode.light:
                        adaptiveTheme.setLight();
                      case AdaptiveThemeMode.dark:
                        adaptiveTheme.setDark();
                      case AdaptiveThemeMode.system:
                        adaptiveTheme.setSystem();
                    }
                  },
                ),
          ),
          const Gap(24),
          Text(l10n.language, style: Theme.of(context).textTheme.titleMedium),
          const Gap(8),
          SegmentedButton<AppLanguage>(
            key: const ValueKey('language-selector'),
            segments: [
              ButtonSegment(
                value: AppLanguage.system,
                label: Text(l10n.system),
              ),
              const ButtonSegment(
                value: AppLanguage.en,
                label: Text('English'),
              ),
              const ButtonSegment(value: AppLanguage.zh, label: Text('中文')),
            ],
            selected: {preferences.language},
            onSelectionChanged: _savingLanguage
                ? null
                : (value) =>
                      _saveLanguage(() => controller.setLanguage(value.single)),
          ),
          if (_savingLanguage) ...[
            const Gap(24),
            const Center(child: CircularProgressIndicator()),
          ],
        ],
      ),
    );
  }
}
