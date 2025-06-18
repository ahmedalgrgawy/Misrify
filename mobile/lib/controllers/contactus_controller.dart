import 'package:flutter/material.dart';
import 'package:flutter_vector_icons/flutter_vector_icons.dart';
import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';
import 'package:graduation_project1/constants/constants.dart';
import 'package:graduation_project1/models/validation_error_model.dart';
import 'package:http/http.dart' as http;

class ContactusController extends GetxController {
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
  void sendmessage(String data) async {
    setLoading = true;
    Uri url = Uri.parse('$appBaseUrl/user/contact');
    Map<String, String> headers = {'Content-Type': 'application/json'};
    try {
      var response = await http.post(url, headers: headers, body: data);

      if (response.statusCode == 201) {
        // ✅ Clear errors on successful registration
        generalError.value = '';
        fieldErrors.clear();

        setLoading = false;
        Get.back();

        Get.snackbar(
          "Message Sent",
          "Thank you for reaching out. We'll get back to you shortly.",
          colorText: kLightWhite,
          backgroundColor: kLightBlue,
          icon:
              const Icon(Ionicons.checkmark_circle_outline, color: kLightWhite),
          snackPosition: SnackPosition.TOP,
          margin: const EdgeInsets.all(16),
          borderRadius: 12,
          duration: const Duration(seconds: 3),
        );
      } else {
        var error = validationErrorResponseFromJson(response.body);

        if (error.message == 'Validation errors') {
          generalError.value = 'Please fix the highlighted errors';
          // ✅ Convert List<String> to Map<String, String>
          Map<String, String> errorMap = {};
          for (var error in error.errors ?? []) {
            if (error.toLowerCase().contains("email")) {
              errorMap["email"] = error;
            } else if (error.toLowerCase().contains("firstName")) {
              errorMap["firstName"] = error;
            } else if (error.toLowerCase().contains("lastName")) {
              errorMap["lastName"] = error;
            } else if (error.toLowerCase().contains("phone")) {
              errorMap["phone"] = error;
            } else if (error.toLowerCase().contains("message")) {
              errorMap["message"] = error;
            }
          }

// ✅ Assign the mapped errors
          fieldErrors.assignAll(errorMap);
        } else {
          generalError.value = error.message;
          Get.snackbar('Failed to send the message', error.message,
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
}
