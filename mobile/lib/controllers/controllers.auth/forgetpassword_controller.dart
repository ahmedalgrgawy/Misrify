import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';
import 'package:graduation_project1/constants/constants.dart';
import 'package:graduation_project1/models/api_error_model.dart';
import 'package:graduation_project1/models/forget_password_response.dart';
import 'package:graduation_project1/views/auth/newpassword/passwordverification_Screen.dart';
import 'package:http/http.dart' as http;

import '../../models/forget_password_model.dart';

class ForgetpasswordController extends GetxController {
  final RxBool _isLoading = false.obs;
  final box = GetStorage(); // Storage instance

  bool get isLoading => _isLoading.value;
  set setLoading(bool newState) {
    _isLoading.value = newState;
  }

  void ForgetpasswordFunction(String data) async {
    setLoading = true;

    Uri url = Uri.parse('$appBaseUrl/auth/forgot-password');
    Map<String, String> headers = {'Content-Type': 'application/json'};

    try {
      var response = await http.post(url, headers: headers, body: data);

      if (response.statusCode == 200) {
        var success = forgetPasswordResponseFromJson(response.body);
        var jsonData = forgetPasswordModelFromJson(data);
        box.write('saved_email', jsonData.email);
        box.write('forgetPassword_otp', success.otp);
        setLoading = false;

        Get.to(() => const PasswordverificationScreen(),
            transition: Transition.fadeIn,
            duration: const Duration(milliseconds: 1200));
      } else {
        var error = apiErrorFromJson(response.body);

        Get.snackbar('Failed to login', error.message,
            colorText: kLightWhite,
            backgroundColor: kRed,
            icon: const Icon(Icons.error_outline));
      }
    } catch (e) {
      debugPrint(e.toString());
    }
  }

  String getSavedEmail() {
    return box.read('saved_email') ?? "";
  }
}
