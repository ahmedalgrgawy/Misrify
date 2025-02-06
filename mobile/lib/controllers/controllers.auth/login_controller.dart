import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';
import 'package:graduation_project1/constants/constants.dart';
import 'package:graduation_project1/data/repositories/authentication_repository.dart';
import 'package:graduation_project1/models/api_error_model.dart';
import 'package:graduation_project1/models/login_response.dart';
import 'package:graduation_project1/models/resetpassword_model.dart';
import 'package:graduation_project1/views/auth/login_Screen.dart';
import 'package:graduation_project1/views/auth/verification_screen.dart';
import 'package:graduation_project1/views/home/Home_Screen.dart';
import 'package:http/http.dart' as http;

class LoginController extends GetxController {
  final RxBool _isLoading = false.obs;
  final box = GetStorage();

  bool get isLoading => _isLoading.value;
  set setLoading(bool newState) {
    _isLoading.value = newState;
  }

  void loginFunction(String data) async {
    setLoading = true;
    Uri url = Uri.parse('$appBaseUrl/login');
    Map<String, String> headers = {'Content-Type': 'application/json'};
    try {
      var response = await http.post(url, headers: headers, body: data);
      if (response.statusCode == 200) {
        LoginResponse data = loginResponseFromJson(response.body);
        String userId = data.user.id;
        String userData = jsonEncode(data);
        box.write(userId, userData);
        //box.write('token', data.userToken);
        box.write('userId', data.user.id);
        box.write('verification', data.user.isVerified);

        setLoading = false;

        Get.snackbar(
          'You are successfully logged in',
          'Enjoy your awesome experience',
          colorText: kLightWhite,
          backgroundColor: kLightBlue,
        );

        if (data.user.isVerified == false) {
          Get.to(() => const VerificationScreen(),
              transition: Transition.fade,
              duration: const Duration(milliseconds: 900));
        }
        if (data.user.isVerified == true) {
          AuthenticationRepository.instance.screenRedirect();
        }
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

  void logout() {
    box.erase();
    Get.offAll(() => const LoginScreen(),
        transition: Transition.fade,
        duration: const Duration(milliseconds: 900));
  }

  LoginResponse? getUserInfo() {
    String? userId = box.read('userId');
    String? data;
    if (userId != null) {
      data = box.read(userId.toString());
    }

    if (data != null) {
      return loginResponseFromJson(data);
    }
    return null;
  }

  ResetPasswordModel? getInfo() {
    String? userId = box.read('userId');
    String? data;
    if (userId != null) {
      data = box.read(userId.toString());
    }

    if (data != null) {
      return resetPasswordModelFromJson(data);
    }
    return null;
  }

  String getVerification() {
    return box.read('verification').toString();
  }
}
