import 'package:adaptive_theme/adaptive_theme.dart';
import 'package:material_ui/material_ui.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:go_router/go_router.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:shared_preferences_platform_interface/in_memory_shared_preferences_async.dart';
import 'package:shared_preferences_platform_interface/shared_preferences_async_platform_interface.dart';
import 'package:__PROJECT_NAME__/app/app.dart';
import 'package:__PROJECT_NAME__/features/settings/data/shared_preferences_repository.dart';
import 'package:__PROJECT_NAME__/features/settings/presentation/preferences_controller.dart';

Future<void> startApp(WidgetTester tester) async {
  final repository = SharedPreferencesRepository(SharedPreferencesAsync());
  final preferences = await repository.read();
  final savedThemeMode = await AdaptiveTheme.getThemeMode();
  final container = ProviderContainer(
    overrides: [
      preferencesRepositoryProvider.overrideWithValue(repository),
      initialPreferencesProvider.overrideWithValue(preferences),
    ],
  );
  addTearDown(container.dispose);
  await tester.pumpWidget(
    UncontrolledProviderScope(
      container: container,
      child: FlutterApp(
        initialThemeMode: savedThemeMode ?? AdaptiveThemeMode.system,
      ),
    ),
  );
  await tester.pumpAndSettle();
}

void main() {
  setUp(() {
    final previous = SharedPreferencesAsyncPlatform.instance;
    // 使用包公开的 Async 内存平台，保留真实 AdaptiveTheme 与仓储读写行为。
    SharedPreferencesAsyncPlatform.instance =
        InMemorySharedPreferencesAsync.withData({
          'app.preferences': '{"language":"en"}',
        });
    addTearDown(() => SharedPreferencesAsyncPlatform.instance = previous);
  });

  testWidgets('首页通过 go_router 进入设置并返回', (tester) async {
    await startApp(tester);
    await tester.tap(find.byKey(const ValueKey('open-settings')));
    await tester.pumpAndSettle();
    expect(
      GoRouterState.of(
        tester.element(find.byKey(const ValueKey('theme-selector'))),
      ).uri.path,
      '/settings',
    );
    await tester.pageBack();
    await tester.pumpAndSettle();
    expect(
      GoRouterState.of(
        tester.element(find.byKey(const ValueKey('open-settings'))),
      ).uri.path,
      '/',
    );
  });

  testWidgets('AdaptiveTheme 切换主题并使用自身存储持久化', (tester) async {
    await startApp(tester);
    await tester.tap(find.byKey(const ValueKey('open-settings')));
    await tester.pumpAndSettle();
    await tester.tap(find.text('Dark'));
    await tester.pumpAndSettle();
    final context = tester.element(
      find.byKey(const ValueKey('theme-selector')),
    );
    expect(Theme.of(context).brightness, Brightness.dark);
    expect(
      AdaptiveTheme.of(context).modeChangeNotifier.value,
      AdaptiveThemeMode.dark,
    );
    expect(await AdaptiveTheme.getThemeMode(), AdaptiveThemeMode.dark);
    expect(
      await SharedPreferencesAsync().getString('app.preferences'),
      '{"language":"en"}',
    );
  });

  testWidgets('重建应用从 AdaptiveTheme 保存模式恢复深色', (tester) async {
    await startApp(tester);
    await tester.tap(find.byKey(const ValueKey('open-settings')));
    await tester.pumpAndSettle();
    await tester.tap(find.text('Dark'));
    await tester.pumpAndSettle();
    expect(await AdaptiveTheme.getThemeMode(), AdaptiveThemeMode.dark);
    await tester.pumpWidget(const SizedBox.shrink());
    await startApp(tester);
    final context = tester.element(find.byKey(const ValueKey('open-settings')));
    expect(Theme.of(context).brightness, Brightness.dark);
  });

  testWidgets('切换语言后显示中文，语言仓储不保存主题', (tester) async {
    await startApp(tester);
    await tester.tap(find.byKey(const ValueKey('open-settings')));
    await tester.pumpAndSettle();
    await tester.tap(find.text('中文'));
    await tester.pumpAndSettle();
    expect(find.text('设置'), findsOneWidget);
    expect(find.text('主题'), findsOneWidget);
    expect(
      await SharedPreferencesAsync().getString('app.preferences'),
      '{"language":"zh"}',
    );
    expect(await AdaptiveTheme.getThemeMode(), AdaptiveThemeMode.system);
  });
}
