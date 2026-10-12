import 'package:flutter_riverpod/flutter_riverpod.dart';

class AppConfig {
  const AppConfig({required this.apiBaseUrl});

  final String apiBaseUrl;

  factory AppConfig.fromEnvironment() {
    const apiBaseUrl = String.fromEnvironment('API_BASE_URL');
    final uri = Uri.parse(apiBaseUrl);
    if (!uri.hasAuthority || !{'http', 'https'}.contains(uri.scheme)) {
      throw StateError('Provide API_BASE_URL using --dart-define-from-file.');
    }
    return const AppConfig(apiBaseUrl: apiBaseUrl);
  }
}

final appConfigProvider = Provider<AppConfig>(
  (ref) => AppConfig.fromEnvironment(),
);
