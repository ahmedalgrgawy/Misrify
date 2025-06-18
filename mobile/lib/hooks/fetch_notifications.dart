import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';
import 'package:http/http.dart' as http;
import '../constants/constants.dart';
import '../models/notification_model.dart';
import '../models/api_error_model.dart';
import '../models/hook_result.dart';
import '../views/auth/login_Screen.dart';
import 'auth_utils.dart';

FetchHook useFetchNotifications() {
  final box = GetStorage();
  final notifications = useState<List<Notifications>?>(null);
  final isLoading = useState<bool>(false);
  final error = useState<Exception?>(null);
  final apiError = useState<ApiError?>(null);

  Future<void> fetchData({bool isRetrying = false}) async {
    isLoading.value = true;

    try {
      final accessToken = box.read('token');
      final url = Uri.parse('$appBaseUrl/user/notification');

      final response = await http.get(url, headers: {
        'Cookie': 'accessToken=$accessToken',
        'Content-Type': 'application/json',
      });

      final decoded = jsonDecode(response.body);
      debugPrint('📬 Notifications response: $decoded');

      if (response.statusCode == 200 &&
          decoded is Map<String, dynamic> &&
          decoded['success'] == true &&
          decoded['notifications'] is List) {
        final notifList =
            List<Map<String, dynamic>>.from(decoded['notifications']);
        notifications.value =
            notifList.map((json) => Notifications.fromJson(json)).toList();
      } else if (response.statusCode == 401 && !isRetrying) {
        final success = await refreshAccessToken();
        if (success) return await fetchData(isRetrying: true);
        Get.offAll(() => const LoginScreen());
      } else {
        notifications.value = [];
        if (decoded is Map<String, dynamic> && decoded.containsKey('message')) {
          apiError.value = ApiError.fromJson(decoded);
        }
      }
    } catch (e) {
      debugPrint('❌ Notification fetch error: $e');
      error.value = Exception(e.toString());
    } finally {
      isLoading.value = false;
    }
  }

  useEffect(() {
    fetchData();
    return null;
  }, []);

  return FetchHook(
    data: notifications.value ?? [],
    isLoading: isLoading.value,
    error: error.value,
    refetch: () async => await fetchData(),
  );
}
