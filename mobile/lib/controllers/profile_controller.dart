import 'dart:convert';
import 'dart:io';
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

    // Optional: file size check (e.g. max 5MB)
    if (bytes.lengthInBytes > 5 * 1024 * 1024) {
      Get.snackbar("Error", "Image is too large. Please choose one under 5MB.",
          backgroundColor: Colors.red, colorText: Colors.white);
      return null;
    }

    final mimeType = pickedFile.mimeType ?? 'image/jpeg';
    return 'data:$mimeType;base64,${base64Encode(bytes)}';
  }

  /// Combines picking image and updating profile
  Future<void> pickImageAndUpdateProfile({
    required String name,
    required String phoneNumber,
    required String address,
  }) async {
    final imgUrl = await pickAndConvertImageToBase64();
    if (imgUrl != null) {
      print('📷 BASE64 (truncated): ${imgUrl.substring(0, 100)}...');
      await updateProfile(
        name: name,
        phoneNumber: phoneNumber,
        address: address,
        imgUrl: imgUrl,
      );
    } else {
      Get.snackbar(
        "Error",
        "No image was selected or it was too large.",
        backgroundColor: Colors.red,
        colorText: Colors.white,
      );
    }
  }

  /// Sends profile update request with optional base64 image under 'imgUrl'
  Future<void> updateProfile({
    required String name,
    required String phoneNumber,
    required String address,
    String? imgUrl,
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
      if (imgUrl != null) 'imgUrl': imgUrl,
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
          imgUrl: imgUrl,
        );
      } else {
        final message = extractErrorMessage(decoded['message']);
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

  /// Extracts a readable error message from any format
  String extractErrorMessage(dynamic messageField) {
    if (messageField is String) {
      return messageField;
    } else if (messageField is Map) {
      return messageField.values.map((v) => v.toString()).join(' | ');
    } else if (messageField is List) {
      return messageField.map((e) => e.toString()).join(' | ');
    } else {
      return jsonEncode(messageField);
    }
  }

  /// Automatically refresh token and retry update
  Future<void> _refreshTokenAndRetry(
    String name,
    String phoneNumber,
    String address, {
    String? imgUrl,
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
        await updateProfile(
          name: name,
          phoneNumber: phoneNumber,
          address: address,
          imgUrl: imgUrl,
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
