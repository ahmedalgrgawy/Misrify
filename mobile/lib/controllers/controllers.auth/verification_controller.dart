import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';
import 'package:graduation_project1/constants/constants.dart';
import 'package:graduation_project1/models/api_error_model.dart';
import 'package:graduation_project1/models/login_response.dart';
import 'package:graduation_project1/views/auth/newpassword/newpassword_screen.dart';
import 'package:graduation_project1/views/home/Home_Screen.dart';
import 'package:http/http.dart' as http;

class VerificationController extends GetxController {
  RxBool _isLoading = false.obs;
  final box = GetStorage();

  dynamic _code;
  dynamic get code => _code;
  String? email;

  set setCode(dynamic value) {
    if (value is String && int.tryParse(value) != null) {
      _code = int.parse(value);
    } else {
      _code = value;
    }
  }

  bool get isLoading => _isLoading.value;
  set setLoading(bool value) {
    _isLoading.value = value;
  }

  void VerificationFunction() async {
    if (code == null) {
      Get.snackbar('Error', 'Please enter the OTP correctly',
          colorText: Colors.white, backgroundColor: Colors.red);
      return;
    }

    setLoading = true;

    Uri url = Uri.parse('$appBaseUrl/auth/verify-email');
    var requestBody = jsonEncode({
      "email": box.read('email'),
      "otp": code,
    });

    Map<String, String> headers = {
      'Content-Type': 'application/json',
    };

    try {
      var response = await http.post(url, headers: headers, body: requestBody);
      if (response.statusCode == 200) {
        LoginResponse data = loginResponseFromJson(response.body);

        String userId = data.user.id;
        String userData = jsonEncode(data);

        box.write(userId, userData);
        box.write('userId', data.user.id);
        box.write('verification', data.user.isVerified);

        setLoading = false;

        Get.offAll(() => HomeScreen());
      } else {
        var error = apiErrorFromJson(response.body);
        Get.snackbar('Failed to verify', error.message,
            colorText: kLightWhite,
            backgroundColor: kRed,
            icon: const Icon(Icons.error_outline));
      }
    } catch (e) {
      debugPrint(e.toString());
    } finally {
      setLoading = false;
    }
  }

  void ResetPasswordVerification() async {
    if (code == null) {
      Get.snackbar('Error', 'Please enter the OTP correctly',
          colorText: Colors.white, backgroundColor: Colors.red);
      return;
    } else if (code != box.read('forgetPassword_otp')) {
      Get.snackbar('Error', 'Wrong OTP',
          colorText: Colors.white, backgroundColor: Colors.red);
      return;
    }

    Get.snackbar('OTP Entered correctly', 'Please, Enter your new password',
        colorText: Colors.white, backgroundColor: Colors.green);

    Get.offAll(() => NewpasswordScreen());
  }
}
