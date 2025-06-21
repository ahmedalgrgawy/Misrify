import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';
import 'package:http/http.dart' as http;
import 'package:graduation_project1/constants/constants.dart';
import 'package:graduation_project1/models/coupon_model.dart';
import 'package:graduation_project1/views/auth/login_Screen.dart';

class CouponController extends GetxController {
  final box = GetStorage();

  RxList<Coupon> coupons = <Coupon>[].obs;
  RxBool isLoading = false.obs;
  RxString? error = RxString('');
  RxString appliedCouponCode = ''.obs;
  RxString appliedCouponId = ''.obs;
  Rx<Coupon?> appliedCoupon = Rx<Coupon?>(null);
  RxInt appliedDiscount = 0.obs;

  final TextEditingController couponTextController = TextEditingController();

  /// Fetch all coupons from server
  Future<void> fetchAllCoupons() async {
    final token = box.read('token');
    if (token == null) return;

    try {
      final url = Uri.parse('$appBaseUrl/user/coupon');
      final response = await http.get(
        url,
        headers: {
          'Cookie': 'accessToken=$token',
          'Content-Type': 'application/json',
        },
      );

      print("🔁 Fetch coupons status: ${response.statusCode}");
      if (response.statusCode == 200) {
        final json = jsonDecode(response.body);
        final allCoupons =
            AllCouponsModel.fromJson(Map<String, dynamic>.from(json));
        coupons.assignAll(allCoupons.coupons);
      } else {
        print("❌ Failed to fetch coupons: ${response.body}");
      }
    } catch (e) {
      print("❌ Exception fetching coupons: $e");
    }
  }

  /// Create a coupon using points
  Future<void> createCoupon(int points, {VoidCallback? onSuccess}) async {
    final token = box.read('token');
    if (token == null) {
      Get.offAll(() => const LoginScreen());
      return;
    }

    final url = Uri.parse('$appBaseUrl/user/coupon/create');
    isLoading.value = true;

    try {
      final response = await http.post(
        url,
        headers: {
          'Cookie': 'accessToken=$token',
          'Content-Type': 'application/json',
        },
        body: jsonEncode({'points': points}),
      );

      print("📨 Create coupon response: ${response.body}");

      if (response.statusCode == 200) {
        Get.snackbar("Success", "Coupon created successfully",
            backgroundColor: Colors.green, colorText: Colors.white);
        onSuccess?.call();
      } else if (response.statusCode == 401) {
        await _refreshTokenAndRetry(
            () => createCoupon(points, onSuccess: onSuccess));
      } else {
        final json = jsonDecode(response.body);
        Get.snackbar("Error", json['message'] ?? "Failed to create coupon",
            backgroundColor: kRed, colorText: kLightWhite);
      }
    } catch (e) {
      print("❌ Exception in createCoupon: $e");
    } finally {
      isLoading.value = false;
    }
  }

  /// Apply a coupon by code
  Future<void> applyCoupon() async {
    final inputCode = couponTextController.text.trim().toLowerCase();
    if (inputCode.isEmpty) {
      Get.snackbar('Error', 'Please enter a coupon code',
          backgroundColor: kRed, colorText: kLightWhite);
      return;
    }

    if (coupons.isEmpty) await fetchAllCoupons();

    final matchedCoupon = coupons.firstWhereOrNull((coupon) =>
        coupon.code.trim().toLowerCase() == inputCode &&
        coupon.isActive &&
        coupon.expirationDate.isAfter(DateTime.now().toUtc()));

    if (matchedCoupon != null) {
      appliedCoupon.value = matchedCoupon;
      appliedDiscount.value = matchedCoupon.discount;
      appliedCouponCode.value = matchedCoupon.code;
      appliedCouponId.value = matchedCoupon.id;
      couponTextController.clear();

      Get.snackbar('Success!', 'Coupon applied: ${matchedCoupon.discount}% off',
          backgroundColor: Colors.green, colorText: Colors.white);
    } else {
      Get.snackbar('Invalid Coupon', 'Coupon not found or expired',
          backgroundColor: kRed, colorText: kLightWhite);
    }
  }

  /// Refresh token logic
  Future<bool> _refreshTokenAndRetry(Function retryFunction) async {
    final refreshToken = box.read('refreshToken');
    if (refreshToken == null) {
      Get.offAll(() => const LoginScreen());
      return false;
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
        await retryFunction();
        return true;
      }
    }

    Get.offAll(() => const LoginScreen());
    return false;
  }
}
