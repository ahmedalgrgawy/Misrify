import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';
import 'package:graduation_project1/models/api_error_model.dart';
import 'package:graduation_project1/models/validation_error_model.dart';
import 'package:http/http.dart' as http;
import 'package:image_picker/image_picker.dart';
import 'package:graduation_project1/constants/constants.dart';
import 'package:graduation_project1/views/auth/login_Screen.dart';

class ProfileController extends GetxController {
  final RxBool _isLoading = false.obs;
  final agreement = false.obs;
  final RxString generalError = ''.obs;
  final RxMap<String, String> fieldErrors = <String, String>{}.obs;
  final box = GetStorage();

  bool get isLoading => _isLoading.value;
  set setLoading(bool newState) => _isLoading.value = newState;

  Future<String?> pickAndConvertImageToBase64() async {
    final picker = ImagePicker();
    final pickedFile = await picker.pickImage(source: ImageSource.gallery);
    if (pickedFile == null) return null;

    final bytes = await pickedFile.readAsBytes();
    if (bytes.lengthInBytes > 5 * 1024 * 1024) {
      Get.snackbar("Error", "Image is too large. Please choose one under 5MB.",
          backgroundColor: Colors.red, colorText: Colors.white);
      return null;
    }

    final mimeType = pickedFile.mimeType ?? 'image/jpeg';
    return 'data:$mimeType;base64,${base64Encode(bytes)}';
  }

  Future<void> pickImageAndUpdateProfile({
    required String name,
    required String phoneNumber,
    required String address,
    required String email,
    required String gender,
    String? currentPassword,
    String? newPassword,
  }) async {
    final imgUrl = await pickAndConvertImageToBase64();
    if (imgUrl != null) {
      await updateProfile(
        name: name,
        phoneNumber: phoneNumber,
        address: address,
        email: email,
        gender: gender,
        currentPassword: currentPassword,
        newPassword: newPassword,
        imgUrl: imgUrl,
      );
    } else {
      Get.snackbar("Error", "No image was selected or it was too large.",
          backgroundColor: Colors.red, colorText: Colors.white);
    }
  }

  Future<void> updateProfile({
    required String name,
    required String phoneNumber,
    required String address,
    required String gender,
    required String email,
    String? currentPassword,
    String? newPassword,
    String? imgUrl,
    VoidCallback? onSuccess,
    bool isRetrying = false,
  }) async {
    setLoading = true;
    final accessToken = box.read('token');
    if (accessToken == null) {
      Get.offAll(() => const LoginScreen());
      return;
    }

    final url = Uri.parse('$appBaseUrl/user/update');
    final headers = {
      'Content-Type': 'application/json',
      'Cookie': 'accessToken=$accessToken',
    };

    final body = {
      'name': name,
      'phoneNumber': phoneNumber,
      'address': address,
      'gender': gender,
      'email': email,
      if (imgUrl != null && imgUrl.isNotEmpty) 'imgUrl': imgUrl,
      if (currentPassword?.isNotEmpty == true &&
          newPassword?.isNotEmpty == true) ...{
        'currentPassword': currentPassword,
        'newPassword': newPassword,
      }
    };

    try {
      final response =
          await http.put(url, headers: headers, body: jsonEncode(body));
      final decoded = jsonDecode(response.body);
      if (response.statusCode == 200 && decoded['success'] == true) {
        fieldErrors.clear();
        generalError.value = '';
        onSuccess?.call();

        Get.snackbar("Success", "Profile updated successfully",
            backgroundColor: Colors.green,
            colorText: Colors.white,
            icon: const Icon(Icons.check_circle, color: Colors.white),
            snackPosition: SnackPosition.TOP,
            margin: const EdgeInsets.all(16),
            borderRadius: 12,
            duration: const Duration(seconds: 3));
      } else if (response.statusCode == 401 && !isRetrying) {
        await _refreshTokenAndRetry(
          name: name,
          phoneNumber: phoneNumber,
          address: address,
          gender: gender,
          email: email,
          currentPassword: currentPassword,
          newPassword: newPassword,
          imgUrl: imgUrl,
        );
      } else if (decoded['message'] == 'Validation errors') {
        final error = validationErrorResponseFromJson(response.body);
        generalError.value = 'Please fix the highlighted errors';

        if (error.errors != null && error.errors!.isNotEmpty) {
          Get.snackbar("Error", error.errors!.first,
              backgroundColor: kRed, colorText: kLightWhite);
        }
      } else {
        final error = apiErrorFromJson(response.body);
        generalError.value = error.message;
        Get.snackbar("Error", error.message,
            backgroundColor: kRed, colorText: kLightWhite);
      }
    } catch (e) {
      generalError.value = 'Something went wrong. Please try again.';
      Get.snackbar("Error", generalError.value,
          backgroundColor: kRed, colorText: kLightWhite);
    } finally {
      setLoading = false;
    }
  }

  Future<void> _refreshTokenAndRetry({
    required String name,
    required String phoneNumber,
    required String address,
    required String gender,
    required String email,
    String? currentPassword,
    String? newPassword,
    String? imgUrl,
  }) async {
    final refreshToken = box.read('refreshToken');
    if (refreshToken == null) {
      Get.offAll(() => const LoginScreen());
      return;
    }

    final refreshUrl = Uri.parse('$appBaseUrl/auth/refresh-token');
    final refreshResponse = await http.post(refreshUrl, headers: {
      'Cookie': refreshToken,
      'Content-Type': 'application/json',
    });

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
          gender: gender,
          email: email,
          currentPassword: currentPassword,
          newPassword: newPassword,
          imgUrl: imgUrl,
          isRetrying: true,
        );
        return;
      }
    }

    Get.offAll(() => const LoginScreen());
  }
}
