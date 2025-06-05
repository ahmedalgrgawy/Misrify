// lib/services/auth_utils.dart
import 'dart:convert';
import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';
import 'package:graduation_project1/constants/constants.dart';
import 'package:graduation_project1/views/auth/login_Screen.dart';
import 'package:http/http.dart' as http;

Future<bool> refreshAccessToken() async {
  final box = GetStorage();
  final refreshToken = box.read('refreshToken');
  if (refreshToken == null) {
    Get.offAll(() => const LoginScreen());
    return false;
  }

  final refreshUrl = Uri.parse('$appBaseUrl/auth/refresh-token');
  final response = await http.post(refreshUrl, headers: {
    'Cookie': refreshToken,
    'Content-Type': 'application/json',
  });

  if (response.statusCode == 200) {
    final cookie = response.headers['set-cookie'];
    final match = RegExp(r'accessToken=([^;]+)').firstMatch(cookie ?? '');
    if (match != null) {
      final newToken = match.group(1);
      GetStorage().write('token', newToken);
      return true;
    }
  }

  Get.offAll(() => const LoginScreen());
  return false;
}
