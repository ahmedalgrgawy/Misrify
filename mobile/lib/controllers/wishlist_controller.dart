// wishlist_controller.dart
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';
import 'package:graduation_project1/constants/constants.dart';
import 'package:graduation_project1/models/api_error_model.dart';
import 'package:graduation_project1/views/auth/login_Screen.dart';
import 'package:http/http.dart' as http;

class WishlistController extends GetxController {
  final box = GetStorage();
  RxBool _isLoading = false.obs;

  bool get isLoading => _isLoading.value;
  set setLoading(bool value) => _isLoading.value = value;

  Future<bool> _refreshToken() async {
    final refreshToken = box.read('refreshToken');
    if (refreshToken == null) return false;

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
          return true;
        }
      }
    }
    return false;
  }

  Future<void> addAndRemoveWishList(String productId,
      {bool isRetrying = false}) async {
    setLoading = true;
    final accessToken = box.read('token');

    final url = Uri.parse("$appBaseUrl/user/toggle-wishlist");
    final headers = {
      'Content-Type': 'application/json',
      'Cookie': 'accessToken=$accessToken',
    };
    final body = jsonEncode({'productId': productId});

    try {
      final response = await http.post(url, headers: headers, body: body);
      debugPrint('Wishlist toggle response: ${response.body}');

      if (response.statusCode == 200) {
        final resData = jsonDecode(response.body);
        Get.snackbar(
          'Wishlist Updated',
          resData['message'] ?? 'Updated successfully',
          colorText: kLightWhite,
          backgroundColor: kLightBlue,
          icon: const Icon(Icons.check_circle_outline, color: kLightWhite),
        );
      } else if (response.statusCode == 401 && !isRetrying) {
        final refreshed = await _refreshToken();
        if (refreshed) {
          await addAndRemoveWishList(productId, isRetrying: true);
          return;
        } else {
          Get.offAll(() => const LoginScreen());
        }
      } else {
        final error = apiErrorFromJson(response.body);
        Get.snackbar(
          'Error',
          error.message,
          colorText: kLightWhite,
          backgroundColor: kRed,
          icon: const Icon(Icons.error_outline, color: kLightWhite),
        );
      }
    } catch (e) {
      debugPrint('Wishlist toggle error: $e');
    } finally {
      setLoading = false;
    }
  }
}
