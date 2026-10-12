import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../features/home/presentation/home_page.dart';
import '../features/settings/presentation/settings_page.dart';

final routerProvider = Provider<GoRouter>((ref) {
  final router = GoRouter(
    routes: [
      GoRoute(path: '/', builder: (context, state) => const HomePage()),
      GoRoute(
        path: '/settings',
        builder: (context, state) => const SettingsPage(),
      ),
    ],
  );
  ref.onDispose(router.dispose);
  return router;
});
