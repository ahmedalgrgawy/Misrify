import 'package:flutter/material.dart';
import 'package:flutter_vector_icons/flutter_vector_icons.dart';
import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';
import 'package:graduation_project1/constants/constants.dart';
import 'package:graduation_project1/models/api_error_model.dart';
import 'package:graduation_project1/models/login_response.dart';
import 'package:graduation_project1/views/auth/login_Screen.dart';
import 'package:graduation_project1/views/auth/verification_screen.dart';
import 'package:http/http.dart' as http;

class RegistrationController extends GetxController {
  RxBool _isLoading = false.obs;
  final agreement = false.obs;

  final box = GetStorage();
  bool get isLoading => _isLoading.value;
  set setLoading(bool newState) {
    _isLoading.value = newState;
  }

  void registerationFunction(String data) async {
    setLoading = true;
    Uri url = Uri.parse('$appBaseUrl/signup');
    Map<String, String> headers = {'Content-Type': 'application/json'};
    if (agreement.isTrue) {
      try {
        var response = await http.post(url, headers: headers, body: data);

        if (response.statusCode == 200) {
          LoginResponse data = loginResponseFromJson(response.body);
          String userEmail = data.user.email;

          box.write("email", userEmail);

          setLoading = false;

          Get.to(() => const VerificationScreen(),
              transition: Transition.fade,
              duration: const Duration(milliseconds: 900));

          Get.snackbar('Registration Successful', 'Please verify your email',
              colorText: kLightWhite,
              backgroundColor: kLightBlue,
              icon: const Icon(Ionicons.checkmark_circle_outline));
        } else {
          var error = apiErrorFromJson(response.body);
          Get.snackbar('Failed to register', error.message,
              colorText: kLightWhite,
              backgroundColor: kRed,
              icon: const Icon(Icons.error_outline));
        }
      } catch (e) {
        debugPrint(e.toString());
        Get.snackbar("Error", "Something went wrong. Please try again.");
      } finally {
        setLoading = false;
      }
    }
    if (agreement.isFalse) {
      Get.snackbar(
          'Failed to register', 'Make sure you agree the tirms and conditions',
          colorText: kLightWhite,
          backgroundColor: kRed,
          icon: const Icon(Icons.error_outline));
    }
  }

  /// **2️⃣ Logout Function**
  void logout() {
    box.erase();
    Get.offAll(() => const LoginScreen(),
        transition: Transition.fade,
        duration: const Duration(milliseconds: 900));
  }

  String getSavedEmail() {
    return box.read('email') ?? "";
  }
}
