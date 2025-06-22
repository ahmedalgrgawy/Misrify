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
  var itemCount = 0.obs;

  bool get isLoading => _isLoading.value;
  set setLoading(bool value) => _isLoading.value = value;

  int get count => itemCount.value;
  void updateItemCount(int count) {
    itemCount.value = count;
  }

  Future<void> clearCart({bool isRetrying = false}) async {
    setLoading = true;
    final accessToken = box.read('token');

    if (accessToken == null) {
      Get.offAll(() => const LoginScreen());
      return;
    }

    final url = Uri.parse('$appBaseUrl/user/clear');
    final headers = {
      'Content-Type': 'application/json',
      'Cookie': 'accessToken=$accessToken',
    };

    try {
      final response = await http.delete(url, headers: headers);
      if (response.statusCode == 200) {
        final resData = jsonDecode(response.body);
        Get.snackbar(
          'Cart Cleared',
          resData['message'] ?? 'Your cart is now empty.',
          colorText: KTextColor,
          backgroundColor: Kbackground,
          icon: const Icon(Icons.delete_outline, color: kLightWhite),
        );
        await refreshCartCount();
      } else if (response.statusCode == 401 && !isRetrying) {
        await refreshTokenAndRetryClear();
      } else {
        final error = apiErrorFromJson(response.body);
        Get.snackbar('Error', error.message);
      }
    } catch (e) {
      debugPrint('🚨 Clear cart error: $e');
    } finally {
      setLoading = false;
    }
  }

  Future<void> refreshTokenAndRetryClear() async {
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
        await clearCart(isRetrying: true);
        return;
      }
    }

    Get.offAll(() => const LoginScreen());
  }

  Future<void> refreshCartCount() async {
    final accessToken = box.read('token');
    if (accessToken == null) return;

    final url = Uri.parse('$appBaseUrl/user/cart');
    final headers = {
      'Content-Type': 'application/json',
      'Cookie': 'accessToken=$accessToken',
    };

    try {
      final response = await http.get(url, headers: headers);
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);

        if (data['cart'] != null && data['cart']['cartItems'] != null) {
          final List<dynamic> items = data['cart']['cartItems'];
          final totalQuantity = items.fold<int>(
            0,
            (sum, item) => sum + (item['quantity'] as int? ?? 1),
          );
          itemCount.value = totalQuantity;
        } else {
          itemCount.value = 0; // fallback for empty or invalid cart
        }
      } else {
        itemCount.value = 0; // fallback for API error
      }
    } catch (e) {
      debugPrint('❌ Failed to refresh cart count: $e');
    }
  }

  Future<void> refreshTokenAndRetry({
    required String productId,
    required int quantity,
    String? color,
    String? size,
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

  Future<void> addToCart({
    required String productId,
    required int quantity,
    String? color,
    String? size,
    bool isRetrying = false,
  }) async {
    setLoading = true;
    final token = box.read('token');

    if (token == null) {
      Get.offAll(() => const LoginScreen());
      return;
    }

    // If no color or size selected, set to fallback values
    final body = {
      'productId': productId,
      'quantity': quantity,
      'color': (color != null && color.trim().isNotEmpty) ? color : 'default',
      'size': (size != null && size.trim().isNotEmpty) ? size : 'default',
    };

    try {
      final response = await http.post(
        Uri.parse('$appBaseUrl/user/addToCart'),
        headers: {
          'Content-Type': 'application/json',
          'Cookie': 'accessToken=$token',
        },
        body: jsonEncode(body),
      );

      if (response.statusCode == 200) {
        final resData = jsonDecode(response.body);
        await refreshCartCount();

        Get.snackbar(
          'Added to cart',
          resData['message'] ?? 'Updated successfully',
          colorText: KTextColor,
          backgroundColor: Kbackground,
          icon: const Icon(Icons.check_circle_outline, color: KTextColor),
        );
      } else if (response.statusCode == 401 && !isRetrying) {
        await refreshTokenAndRetry(
          productId: productId,
          quantity: quantity,
          color: color,
          size: size,
        );
      } else {
        final error = apiErrorFromJson(response.body);
        debugPrint('❌ API Error: ${response.body}');
        Get.snackbar(
          'Error',
          error.message,
          colorText: kLightWhite,
          backgroundColor: kLightBlue,
        );
      }
    } catch (e) {
      debugPrint('🚨 Add to cart error: $e');
    } finally {
      setLoading = false;
    }
  }

  Future<void> removeFromCart(String cartItemId,
      {bool isRetrying = false}) async {
    setLoading = true;
    final accessToken = box.read('token');

    if (accessToken == null) {
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
      if (response.statusCode == 200) {
        final resData = jsonDecode(response.body);
        Get.snackbar(
          'Removed from cart',
          resData['message'] ?? 'Updated successfully',
          colorText: kLightWhite,
          backgroundColor: kLightBlue,
          icon: const Icon(Icons.check_circle_outline, color: kLightWhite),
        );
        await refreshCartCount();
      } else if (response.statusCode == 401 && !isRetrying) {
        await refreshTokenAndRetryForRemove(cartItemId);
      } else {
        final error = apiErrorFromJson(response.body);
        Get.snackbar('Error', error.message);
      }
    } catch (e) {
      debugPrint('🚨 Remove cart error: $e');
    } finally {
      setLoading = false;
    }
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

  Future<void> updateCartItemQuantity({
    required String cartItemId,
    required String operation,
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

    await refreshCartCount();
  }
}
