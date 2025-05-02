import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';
import 'package:graduation_project1/constants/constants.dart';
import 'package:graduation_project1/models/api_error_model.dart';
import 'package:graduation_project1/views/auth/login_Screen.dart';
import 'package:http/http.dart' as http;

class CartController extends GetxController {
  final box = GetStorage();
  RxBool _isLoading = false.obs;

  bool get isLoading => _isLoading.value;
  set setLoading(bool value) => _isLoading.value = value;

  // ───────────────── REFRESH TOKEN ─────────────────
  Future<void> refreshTokenAndRetry({
    required String productId,
    required int quantity,
    required String color,
    required String size,
  }) async {
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
      final match = RegExp(r'accessToken=([^;]+)').firstMatch(newCookie ?? '');
      if (match != null) {
        final newToken = match.group(1);
        box.write('token', newToken);
        await addToCart(
          productId: productId,
          quantity: quantity,
          color: color,
          size: size,
          isRetrying: true,
        );
        return;
      }
    }

    Get.offAll(() => const LoginScreen());
  }

  Future<void> refreshTokenAndRetryForRemove(String cartItemId) async {
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
      final match = RegExp(r'accessToken=([^;]+)').firstMatch(newCookie ?? '');
      if (match != null) {
        final newToken = match.group(1);
        box.write('token', newToken);
        await removeFromCart(cartItemId, isRetrying: true);
        return;
      }
    }

    Get.offAll(() => const LoginScreen());
  }

  // ───────────────── ADD TO CART ─────────────────
  Future<void> addToCart({
    required String productId,
    required int quantity,
    required String color,
    required String size,
    bool isRetrying = false,
  }) async {
    setLoading = true;
    final accessToken = box.read('token');

    if (accessToken == null) {
      debugPrint('❌ Access token is null');
      Get.offAll(() => const LoginScreen());
      return;
    }

    final url = Uri.parse('$appBaseUrl/user/addToCart');
    final headers = {
      'Content-Type': 'application/json',
      'Cookie': 'accessToken=$accessToken',
    };

    final body = jsonEncode({
      'productId': productId,
      'quantity': quantity,
      'color': color,
      'size': size,
    });

    try {
      final response = await http.post(url, headers: headers, body: body);
      debugPrint(
          '📦 Add to cart response: ${response.statusCode} ${response.body}');

      if (response.statusCode == 200) {
        final resData = jsonDecode(response.body);
        Get.snackbar(
          'Cart Updated',
          resData['message'] ?? 'Product added to cart successfully',
          colorText: kLightWhite,
          backgroundColor: kLightBlue,
          icon: const Icon(Icons.check_circle_outline, color: kLightWhite),
        );
      } else if (response.statusCode == 401 && !isRetrying) {
        await refreshTokenAndRetry(
            productId: productId, quantity: quantity, color: color, size: size);
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
      debugPrint('🚨 Add to cart error: $e');
    } finally {
      setLoading = false;
    }
  }

  // ───────────────── REMOVE FROM CART ─────────────────
  Future<void> removeFromCart(String cartItemId,
      {bool isRetrying = false}) async {
    setLoading = true;
    final accessToken = box.read('token');

    if (accessToken == null) {
      debugPrint('❌ Access token is null');
      Get.offAll(() => const LoginScreen());
      return;
    }

    final url = Uri.parse('$appBaseUrl/user/remove-item');
    final headers = {
      'Content-Type': 'application/json',
      'Cookie': 'accessToken=$accessToken',
    };

    final body = jsonEncode({'cartItemId': cartItemId});

    try {
      final response = await http.delete(url, headers: headers, body: body);
      debugPrint(
          '🗑️ Remove from cart response: ${response.statusCode} ${response.body}');

      if (response.statusCode == 200) {
        final resData = jsonDecode(response.body);
        Get.snackbar(
          'Cart Updated',
          resData['message'] ?? 'Item removed from cart',
          colorText: kLightWhite,
          backgroundColor: kLightBlue,
          icon: const Icon(Icons.check_circle_outline, color: kLightWhite),
        );
      } else if (response.statusCode == 401 && !isRetrying) {
        await refreshTokenAndRetryForRemove(cartItemId);
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
      debugPrint('🚨 Remove cart error: $e');
    } finally {
      setLoading = false;
    }
  }

  Future<void> updateCartItemQuantity({
    required String cartItemId,
    required String operation, // "add" or "remove"
  }) async {
    final token = GetStorage().read('token');
    final url = Uri.parse('$appBaseUrl/user/update-quantity');

    final response = await http.put(
      url,
      headers: {
        'Content-Type': 'application/json',
        'Cookie': 'accessToken=$token',
      },
      body: jsonEncode({
        "cartItemId": cartItemId,
        "operation": operation,
      }),
    );

    debugPrint("🛒 Quantity update response: ${response.body}");
  }
}
