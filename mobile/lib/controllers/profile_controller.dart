import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';
import 'package:http/http.dart' as http;
import 'package:image_picker/image_picker.dart';
import 'package:graduation_project1/constants/constants.dart';
import 'package:graduation_project1/views/auth/login_Screen.dart';

class ProfileController extends GetxController {
  final box = GetStorage();
  RxBool isLoading = false.obs;

  /// Picks an image and converts it to a base64 string with the required prefix
  Future<String?> pickAndConvertImageToBase64() async {
    final picker = ImagePicker();
    final pickedFile = await picker.pickImage(source: ImageSource.gallery);

    if (pickedFile == null) return null;

    final bytes = await pickedFile.readAsBytes();
    final ext = pickedFile.path.split('.').last.toLowerCase();
    return 'data:image/$ext;base64,${base64Encode(bytes)}';
  }

  /// Sends profile update request with optional base64 image
  Future<void> updateProfile({
    required String name,
    required String phoneNumber,
    required String address,
    String? base64Image,
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
      if (base64Image != null) 'imgUrl': base64Image,
    });

    final headers = {
      'Content-Type': 'application/json',
      'Cookie': 'accessToken=$accessToken',
    };

    try {
      final response = await http.put(url, headers: headers, body: body);
      final decoded = jsonDecode(response.body);
      debugPrint('🟡 Response Body: ${response.body}');

      if (response.statusCode == 200 && decoded['success'] == true) {
        Get.snackbar(
          "Success",
          "Profile updated successfully",
          backgroundColor: Colors.green,
          colorText: Colors.white,
          icon: const Icon(Icons.check_circle, color: Colors.white),
        );
      } else if (response.statusCode == 401 && !isRetrying) {
        await _refreshTokenAndRetry(
          name,
          phoneNumber,
          address,
          base64Image: base64Image,
        );
      } else {
        final message = decoded['message']?.toString() ?? 'Unexpected error';
        Get.snackbar(
          "Error",
          message,
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

  /// Automatically refresh token and retry update
  Future<void> _refreshTokenAndRetry(
    String name,
    String phoneNumber,
    String address, {
    String? base64Image,
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
        box.write('token', newToken); // ✅ Save token before retry
        await updateProfile(
          name: name,
          phoneNumber: phoneNumber,
          address: address,
          base64Image: base64Image,
          isRetrying: true,
        );
        return;
      } else {
        debugPrint(
            "⚠️ Token regex failed. No accessToken found in set-cookie.");
      }
    } else {
      debugPrint("⚠️ Token refresh failed: ${refreshResponse.body}");
    }

    Get.offAll(() => const LoginScreen());
  }
}
