import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';
import 'package:graduation_project1/constants/constants.dart';
import 'package:graduation_project1/models/api_error_model.dart';
import 'package:graduation_project1/models/cart_response.dart';
import 'package:graduation_project1/models/hook_result.dart';
import 'package:graduation_project1/views/auth/login_Screen.dart';
import 'package:http/http.dart' as http;

FetchHook useFetchcart() {
  final box = GetStorage();
  final cart = useState<Cart?>(null);
  final isLoading = useState<bool>(false);
  final error = useState<Exception?>(null);
  final apiError = useState<ApiError?>(null);

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
        final match = RegExp(r'accessToken=([^;]+)').firstMatch(newCookie);
        if (match != null) {
          final newToken = match.group(1);
          box.write('token', newToken);
          await fetchData(isRetrying: true);
          return;
        }
      }
    }

    Get.offAll(() => const LoginScreen());
  }

  fetchData = ({bool isRetrying = false}) async {
    isLoading.value = true;

    try {
      final accessToken = box.read('token');
      final url = Uri.parse('$appBaseUrl/user/cart');

      final response = await http.get(
        url,
        headers: {
          'Cookie': 'accessToken=$accessToken',
          'Content-Type': 'application/json',
        },
      );

      final decoded = jsonDecode(response.body);

      if (response.statusCode == 200 &&
          decoded is Map<String, dynamic> &&
          decoded['success'] == true) {
        final parsedModel = CartResponse.fromJson(decoded);
        cart.value = parsedModel.cart;
      } else if (response.statusCode == 401 && !isRetrying) {
        await refreshTokenAndRetry();
      } else {
        cart.value = null;
        if (decoded is Map<String, dynamic> && decoded.containsKey('message')) {
          apiError.value = ApiError.fromJson(decoded);
        }
      }
    } catch (e) {
      debugPrint('Cart fetch error: $e');
    } finally {
      isLoading.value = false;
    }
  };

  useEffect(() {
    fetchData();
    return null;
  }, []);

  Future<void> refetch() async => await fetchData();

  return FetchHook(
    data: cart.value,
    isLoading: isLoading.value,
    error: error.value,
    refetch: refetch,
  );
}
