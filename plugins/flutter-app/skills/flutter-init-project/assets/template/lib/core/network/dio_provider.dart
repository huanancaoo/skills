import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../config/app_config.dart';

final dioProvider = Provider<Dio>((ref) {
  final config = ref.watch(appConfigProvider);
  final dio = Dio(BaseOptions(baseUrl: config.apiBaseUrl));
  ref.onDispose(dio.close);
  return dio;
});
