import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';
import 'package:graduation_project1/constants/constants.dart';
import 'package:graduation_project1/models/api_error_model.dart';
import 'package:graduation_project1/models/resetpassword_model.dart';
import 'package:graduation_project1/views/auth/success_screen.dart';
import 'package:http/http.dart' as http;

class ResetpasswordController extends GetxController {
  RxBool _isLoading = false.obs;
  final box = GetStorage();

  String _password = '';
  String get password => _password;
  String? email;

  set setPassword(String value) {
    _password = value;
  }

  bool get isLoading => _isLoading.value;
  set setLoading(bool value) {
    _isLoading.value = value;
  }

  void ResetFunction() async {
    if (password == '') {
      Get.snackbar('Error', 'Please enter the Password',
          colorText: Colors.white, backgroundColor: Colors.red);
      return;
    }

    setLoading = true;

    Uri url = Uri.parse('$appBaseUrl/auth/reset-password');
    var requestBody = jsonEncode({
      "email": box.read('saved_email'),
      "resetPasswordOtp": box.read('forgetPassword_otp').toString(),
      "newPassword": password
    });

    Map<String, String> headers = {
      'Content-Type': 'application/json',
    };

    try {
      var response = await http.post(url, headers: headers, body: requestBody);
      print(response.statusCode);
      if (response.statusCode == 200) {
        ResetPasswordModel data = resetPasswordModelFromJson(response.body);

        String userId = data.user.id;
        String userData = jsonEncode(data);

        box.write(userId, userData);
        box.write('userId', data.user.id);

        box.write('verification', data.user.isVerified);

        setLoading = false;

        Get.offAll(() => SuccessScreen());
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
}
