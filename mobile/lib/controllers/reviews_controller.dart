import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';
import 'package:graduation_project1/constants/constants.dart';
import 'package:graduation_project1/models/api_error_model.dart';
import 'package:graduation_project1/views/auth/login_Screen.dart';
import 'package:http/http.dart' as http;

class ReviewController extends GetxController {
  final box = GetStorage();
  RxBool _isLoading = false.obs;

  bool get isLoading => _isLoading.value;
  set setLoading(bool value) => _isLoading.value = value;

  // ----------------------- CREATE REVIEW -----------------------
  Future<Map<String, dynamic>?> submitReview({
    required String productId,
    required int rating,
    required String reviewText,
    bool isRetrying = false,
  }) async {
    setLoading = true;
    final accessToken = box.read('token');

    final url = Uri.parse("$appBaseUrl/user/reviews/create");
    final headers = {
      'Content-Type': 'application/json',
      'Cookie': 'accessToken=$accessToken',
    };
    final body = jsonEncode({
      'productId': productId,
      'rating': rating,
      'reviewText': reviewText, // ✅ correct
    });

    try {
      final response = await http.post(url, headers: headers, body: body);
      debugPrint('Review creation response: ${response.body}');

      if (response.statusCode == 201) {
        final resData = jsonDecode(response.body);
        Get.snackbar(
          'Review Added',
          resData['message'] ?? 'Thanks for your feedback!',
          colorText: kLightWhite,
          backgroundColor: kLightBlue,
          icon: const Icon(Icons.check_circle_outline, color: kLightWhite),
        );
        return resData; // return the review map
      } else if (response.statusCode == 401 && !isRetrying) {
        await _refreshTokenAndRetryCreate(productId, rating, reviewText);
        return null; // ✅ safe return
      } else {
        final error = apiErrorFromJson(response.body);
        Get.snackbar('Error', error.message,
            colorText: kLightWhite,
            backgroundColor: kRed,
            icon: const Icon(Icons.error_outline, color: kLightWhite));
      }
    } catch (e) {
      debugPrint('Review creation error: $e');
    } finally {
      setLoading = false;
    }
    return null;
  }

  Future<Map<String, dynamic>?> _refreshTokenAndRetryCreate(
      String productId, int rating, String reviewText) async {
    final refreshToken = box.read('refreshToken');
    if (refreshToken == null) {
      Get.offAll(() => const LoginScreen());
      return null;
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
        box.write('token', match.group(1));
        return await submitReview(
          productId: productId,
          rating: rating,
          reviewText: reviewText,
          isRetrying: true,
        );
      }
    }

    Get.offAll(() => const LoginScreen());
    return null;
  }

  // ----------------------- UPDATE REVIEW -----------------------
  Future<void> updateReview({
    required String reviewId,
    required int rating,
    required String reviewText,
    bool isRetrying = false,
  }) async {
    setLoading = true;
    final accessToken = box.read('token');

    final url = Uri.parse("$appBaseUrl/user/reviews/$reviewId");
    final headers = {
      'Content-Type': 'application/json',
      'Cookie': 'accessToken=$accessToken',
    };
    final body = jsonEncode({
      'rating': rating,
      'reviewText': reviewText,
    });

    try {
      final response = await http.put(url, headers: headers, body: body);
      debugPrint('Review update response: ${response.body}');

      if (response.statusCode == 200) {
        final resData = jsonDecode(response.body);
        Get.snackbar(
          'Review Updated',
          resData['message'] ?? 'Your review has been updated!',
          colorText: kLightWhite,
          backgroundColor: kLightBlue,
          icon: const Icon(Icons.check_circle_outline, color: kLightWhite),
        );
      } else if (response.statusCode == 401 && !isRetrying) {
        await _refreshTokenAndRetryUpdate(reviewId, rating, reviewText);
      } else {
        final error = apiErrorFromJson(response.body);
        Get.snackbar('Error', error.message,
            colorText: kLightWhite,
            backgroundColor: kRed,
            icon: const Icon(Icons.error_outline, color: kLightWhite));
      }
    } catch (e) {
      debugPrint('Review update error: $e');
    } finally {
      setLoading = false;
    }
  }

  Future<void> _refreshTokenAndRetryUpdate(
      String reviewId, int rating, String reviewText) async {
    final refreshToken = box.read('refreshToken');
    if (refreshToken == null) return Get.offAll(() => const LoginScreen());

    final refreshUrl = Uri.parse('$appBaseUrl/auth/refresh-token');
    final refreshResponse = await http.post(refreshUrl, headers: {
      'Cookie': refreshToken,
      'Content-Type': 'application/json',
    });

    if (refreshResponse.statusCode == 200) {
      final newCookie = refreshResponse.headers['set-cookie'];
      final match = RegExp(r'accessToken=([^;]+)').firstMatch(newCookie ?? '');
      if (match != null) {
        box.write('token', match.group(1));
        await updateReview(
          reviewId: reviewId,
          rating: rating,
          reviewText: reviewText,
          isRetrying: true,
        );
        return;
      }
    }

    Get.offAll(() => const LoginScreen());
  }

  // ----------------------- DELETE REVIEW -----------------------
  Future<void> deleteReview(String reviewId, {bool isRetrying = false}) async {
    setLoading = true;
    final accessToken = box.read('token');

    final url = Uri.parse("$appBaseUrl/user/reviews/$reviewId");
    final headers = {
      'Cookie': 'accessToken=$accessToken',
      'Content-Type': 'application/json',
    };

    try {
      final response = await http.delete(url, headers: headers);
      debugPrint('Review delete response: ${response.body}');

      if (response.statusCode == 200) {
        final resData = jsonDecode(response.body);
        Get.snackbar(
          'Review Deleted',
          resData['message'] ?? 'Review successfully deleted.',
          colorText: kLightWhite,
          backgroundColor: kLightBlue,
          icon: const Icon(Icons.delete_forever, color: kLightWhite),
        );
      } else if (response.statusCode == 401 && !isRetrying) {
        await _refreshTokenAndRetryDelete(reviewId);
      } else {
        final error = apiErrorFromJson(response.body);
        Get.snackbar('Error', error.message,
            colorText: kLightWhite,
            backgroundColor: kRed,
            icon: const Icon(Icons.error_outline, color: kLightWhite));
      }
    } catch (e) {
      debugPrint('Review delete error: $e');
    } finally {
      setLoading = false;
    }
  }

  Future<void> _refreshTokenAndRetryDelete(String reviewId) async {
    final refreshToken = box.read('refreshToken');
    if (refreshToken == null) return Get.offAll(() => const LoginScreen());

    final refreshUrl = Uri.parse('$appBaseUrl/auth/refresh-token');
    final refreshResponse = await http.post(refreshUrl, headers: {
      'Cookie': refreshToken,
      'Content-Type': 'application/json',
    });

    if (refreshResponse.statusCode == 200) {
      final newCookie = refreshResponse.headers['set-cookie'];
      final match = RegExp(r'accessToken=([^;]+)').firstMatch(newCookie ?? '');
      if (match != null) {
        box.write('token', match.group(1));
        await deleteReview(reviewId, isRetrying: true);
        return;
      }
    }

    Get.offAll(() => const LoginScreen());
  }
}
