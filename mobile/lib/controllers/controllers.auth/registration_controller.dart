import 'package:flutter/material.dart';
import 'package:flutter_vector_icons/flutter_vector_icons.dart';
import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';
import 'package:graduation_project1/constants/constants.dart';
import 'package:graduation_project1/models/login_response.dart';
import 'package:graduation_project1/models/validation_error_model.dart';
import 'package:graduation_project1/views/auth/login_Screen.dart';
import 'package:graduation_project1/views/auth/verification_screen.dart';
import 'package:http/http.dart' as http;

class RegistrationController extends GetxController {
  final RxBool _isLoading = false.obs;
  final agreement = false.obs;
  final RxString generalError = ''.obs;
  final RxMap<String, String> fieldErrors = <String, String>{}.obs;
  final box = GetStorage();

  bool get isLoading => _isLoading.value;
  set setLoading(bool newState) {
    _isLoading.value = newState;
  }

  /// ✅ Register function with improved validation & error handling
  void registerUser(String data) async {
    setLoading = true;
    Uri url = Uri.parse('$appBaseUrl/auth/signup');
    Map<String, String> headers = {'Content-Type': 'application/json'};

    // ✅ Ensure user agrees to terms before proceeding
    if (!agreement.value) {
      Get.snackbar(
          'Failed to register', 'You must agree to the terms and conditions',
          colorText: kLightWhite,
          backgroundColor: kRed,
          icon: const Icon(Icons.error_outline));
      setLoading = false;
      return;
    }

    try {
      var response = await http.post(url, headers: headers, body: data);

      if (response.statusCode == 200) {
        // ✅ Clear errors on successful registration
        generalError.value = '';
        fieldErrors.clear();

        LoginResponse responseData = loginResponseFromJson(response.body);
        box.write("email", responseData.user.email);

        setLoading = false;
        Get.to(() => const VerificationScreen(),
            transition: Transition.fade,
            duration: const Duration(milliseconds: 900));

        Get.snackbar('Registration Successful', 'Please verify your email',
            colorText: kLightWhite,
            backgroundColor: kLightBlue,
            icon: const Icon(Ionicons.checkmark_circle_outline));
      } else {
        var error = validationErrorResponseFromJson(response.body);

        if (error.message == 'Validation errors') {
          generalError.value = 'Please fix the highlighted errors';
          // ✅ Convert List<String> to Map<String, String>
          Map<String, String> errorMap = {};
          for (var error in error.errors ?? []) {
            if (error.toLowerCase().contains("email")) {
              errorMap["email"] = error;
            } else if (error.toLowerCase().contains("password")) {
              errorMap["password"] = error;
            } else if (error.toLowerCase().contains("name")) {
              errorMap["name"] = error;
            } else if (error.toLowerCase().contains("phone")) {
              errorMap["phoneNumber"] = error;
            } else if (error.toLowerCase().contains("address")) {
              errorMap["address"] = error;
            } else if (error.toLowerCase().contains("gender")) {
              errorMap["gender"] = error;
            } else {
              errorMap["general"] = error; // General error fallback
            }
          }

// ✅ Assign the mapped errors
          fieldErrors.assignAll(errorMap);
        } else {
          generalError.value = error.message;
          Get.snackbar('Failed to register', error.message,
              colorText: kLightWhite,
              backgroundColor: kRed,
              icon: const Icon(Icons.error_outline));
        }
      }
    } catch (e) {
      generalError.value = 'Something went wrong. Please try again.';
      debugPrint(e.toString());
      Get.snackbar("Error", "Something went wrong. Please try again.",
          backgroundColor: kRed, colorText: kLightWhite);
    } finally {
      setLoading = false;
    }
  }

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
