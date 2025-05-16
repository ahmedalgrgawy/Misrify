import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';
import 'package:http/http.dart' as http;
import 'package:graduation_project1/constants/constants.dart';
import 'package:graduation_project1/models/api_error_model.dart';
import 'package:graduation_project1/views/auth/login_Screen.dart';

class ProfileController extends GetxController {
  final box = GetStorage();
  RxBool isLoading = false.obs;

  Future<void> updateProfile({
    required String name,
    required String phoneNumber,
    required String address,
    bool isRetrying = false,
  }) async {
    isLoading.value = true;
    final accessToken = box.read('token');

    if (accessToken == null) {
      Get.offAll(() => const LoginScreen());
      return;
    }

    final url = Uri.parse('$appBaseUrl/user/update');
    final body = jsonEncode({
      'name': name,
      'phoneNumber': phoneNumber,
      'address': address,
    });

    final headers = {
      'Content-Type': 'application/json',
      'Cookie': 'accessToken=$accessToken',
    };

    try {
      final response = await http.put(url, headers: headers, body: body);
      final decoded = jsonDecode(response.body);

      if (response.statusCode == 200 && decoded['success'] == true) {
        Get.snackbar(
          "Success",
          "Profile updated successfully",
          backgroundColor: Colors.green,
          colorText: Colors.white,
          icon: const Icon(Icons.check_circle, color: Colors.white),
        );
      } else if (response.statusCode == 401 && !isRetrying) {
        await _refreshTokenAndRetry(name, phoneNumber, address);
      } else {
        final error = apiErrorFromJson(response.body);
        Get.snackbar(
          "Error",
          error.message,
          backgroundColor: Colors.red,
          colorText: Colors.white,
        );
      }
    } catch (e) {
      debugPrint('❌ Profile update failed: $e');
      Get.snackbar(
        "Error",
        "Something went wrong. Please try again.",
        backgroundColor: Colors.red,
        colorText: Colors.white,
      );
    } finally {
      isLoading.value = false;
    }
  }

  Future<void> _refreshTokenAndRetry(
      String name, String phoneNumber, String address) async {
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
        await updateProfile(
          name: name,
          phoneNumber: phoneNumber,
          address: address,
          isRetrying: true,
        );
        return;
      }
    }

    Get.offAll(() => const LoginScreen());
  }
}
