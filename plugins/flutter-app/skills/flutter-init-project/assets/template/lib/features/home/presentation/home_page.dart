import 'package:material_ui/material_ui.dart';
import 'package:go_router/go_router.dart';

import '../../../l10n/app_localizations.dart';

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context);
    return Scaffold(
      appBar: AppBar(title: Text(l10n.appTitle)),
      body: Center(
        child: FilledButton.icon(
          key: const ValueKey('open-settings'),
          onPressed: () => context.push('/settings'),
          icon: const Icon(Icons.settings_outlined),
          label: Text(l10n.settings),
        ),
      ),
    );
  }
}
