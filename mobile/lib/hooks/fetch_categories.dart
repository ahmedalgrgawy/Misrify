import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:graduation_project1/constants/constants.dart';
import 'package:graduation_project1/models/api_error_model.dart';
import 'package:graduation_project1/models/categories_model.dart';
import 'package:graduation_project1/models/hook_result.dart';
import 'package:http/http.dart' as http;
import 'package:get_storage/get_storage.dart';
import 'package:get/get.dart';
import 'package:graduation_project1/views/auth/login_Screen.dart';

FetchHook useFetchCategories() {
  final categoriesItems = useState<List<Category>?>(null);
  final isLoading = useState<bool>(false);
  final error = useState<Exception?>(null);
  final apiError = useState<ApiError?>(null);
  final box = GetStorage();

  late Future<void> Function({bool isRetrying}) fetchData;

  Future<void> refreshTokenAndRetry() async {
    final refreshToken = box.read('refreshToken');
    if (refreshToken == null) {
      Get.offAll(() => const LoginScreen());

      return;
    }

    final refreshUrl = Uri.parse('$appBaseUrl/auth/refresh-token');
    final refreshResponse = await http.post(
      refreshUrl,
      headers: {
        'Cookie': refreshToken,
        'Content-Type': 'application/json',
      },
    );

    if (refreshResponse.statusCode == 200) {
      final newCookie = refreshResponse.headers['set-cookie'];
      if (newCookie != null) {
        final parts = newCookie.split(',');
        for (var part in parts) {
          if (part.contains('accessToken=')) {
            final token = part.trim().split(';')[0];
            box.write('token', token);
          }
        }
        box.read('token');
        await fetchData(isRetrying: true);
      }
    } else {
      Get.offAll(() => const LoginScreen());
    }
  }

  fetchData = ({bool isRetrying = false}) async {
    isLoading.value = true;

    try {
      Uri url = Uri.parse('$appBaseUrl/admin/Categories');
      final token = box.read('token');
      final response = await http.get(
        url,
        headers: {
          'Cookie': token ?? '',
          'Content-Type': 'application/json',
        },
      );

      if (response.statusCode == 200) {
        final parsed = categoriesModelFromJson(response.body);
        categoriesItems.value = parsed.categories;
      } else if (response.statusCode == 401 && !isRetrying) {
        await refreshTokenAndRetry();
      } else {
        apiError.value = apiErrorFromJson(response.body);
      }
    } catch (e) {
      debugPrint("Exception: $e");
    } finally {
      isLoading.value = false;
    }
  };

  useEffect(() {
    fetchData();
    return null;
  }, []);

  Future<void> refetch() async {
    isLoading.value = true;
    fetchData();
  }

  return FetchHook(
    data: categoriesItems.value,
    isLoading: isLoading.value,
    error: error.value,
    refetch: refetch,
  );
}
