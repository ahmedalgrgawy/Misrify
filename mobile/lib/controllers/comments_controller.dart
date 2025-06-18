import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';
import 'package:graduation_project1/constants/constants.dart';
import 'package:graduation_project1/models/api_error_model.dart';
import 'package:graduation_project1/views/auth/login_Screen.dart';
import 'package:http/http.dart' as http;

class CommentsController extends GetxController {
  final box = GetStorage();
  RxBool _isLoading = false.obs;

  bool get isLoading => _isLoading.value;
  set setLoading(bool value) => _isLoading.value = value;

  // ----------------------- CREATE COMMENT -----------------------
  Future<Map<String, dynamic>?> createComment(
    String text,
    String reviewId, {
    bool isRetrying = false,
  }) async {
    final accessToken = box.read('token');
    final url = Uri.parse("$appBaseUrl/user/comments/create");

    final headers = {
      'Content-Type': 'application/json',
      'Cookie': 'accessToken=$accessToken',
    };

    final body = jsonEncode({
      'text': text,
      'reviewId': reviewId,
    });

    try {
      final response = await http.post(url, headers: headers, body: body);
      debugPrint('Create Comment Response: ${response.body}');

      if (response.statusCode == 201) {
        final resData = jsonDecode(response.body);
        Get.snackbar("Comment Added", resData['message'] ?? "Success",
            backgroundColor: kLightBlue, colorText: kLightWhite);
        return resData['comment']; // ✅ return the created comment
      } else if (response.statusCode == 401 && !isRetrying) {
        return await _refreshTokenAndRetryCreate(text, reviewId);
      } else {
        final error = apiErrorFromJson(response.body);
        Get.snackbar("Error", error.message,
            backgroundColor: kRed, colorText: kLightWhite);
      }
    } catch (e) {
      debugPrint("Comment creation error: $e");
    }
    return null;
  }

  Future<Map<String, dynamic>?> _refreshTokenAndRetryCreate(
    String text,
    String reviewId,
  ) async {
    final refreshToken = box.read('refreshToken');
    if (refreshToken == null) {
      Get.offAll(() => const LoginScreen());
      return null;
    }

    final refreshUrl = Uri.parse("$appBaseUrl/auth/refresh-token");
    final refreshResponse = await http.post(refreshUrl, headers: {
      'Cookie': refreshToken,
      'Content-Type': 'application/json',
    });

    if (refreshResponse.statusCode == 200) {
      final newCookie = refreshResponse.headers['set-cookie'];
      final match = RegExp(r'accessToken=([^;]+)').firstMatch(newCookie ?? '');
      if (match != null) {
        box.write('token', match.group(1));
        return await createComment(text, reviewId, isRetrying: true);
      }
    } else {
      Get.offAll(() => const LoginScreen());
    }
    return null;
  }

  // ----------------------- UPDATE COMMENT -----------------------
  Future<bool> updateComment(String commentId, String text,
      {bool isRetrying = false}) async {
    setLoading = true;
    final accessToken = box.read('token');
    final url = Uri.parse("$appBaseUrl/user/comment/$commentId");

    final headers = {
      'Content-Type': 'application/json',
      'Cookie': 'accessToken=$accessToken',
    };

    final body = jsonEncode({'text': text});

    try {
      final response = await http.put(url, headers: headers, body: body);
      debugPrint('Update Comment Response: ${response.body}');

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        Get.snackbar("Comment Updated", data['message'] ?? "Success",
            backgroundColor: kLightBlue, colorText: kLightWhite);
        return true;
      } else if (response.statusCode == 401 && !isRetrying) {
        return await _refreshTokenAndRetryUpdate(commentId, text);
      } else {
        final error = apiErrorFromJson(response.body);
        Get.snackbar("Error", error.message,
            backgroundColor: kRed, colorText: kLightWhite);
      }
    } catch (e) {
      debugPrint("Update Comment Error: $e");
    } finally {
      setLoading = false;
    }
    return false;
  }

  Future<bool> _refreshTokenAndRetryUpdate(
      String commentId, String text) async {
    final refreshToken = box.read('refreshToken');
    if (refreshToken == null) {
      Get.offAll(() => const LoginScreen());
      return false;
    }

    final refreshUrl = Uri.parse("$appBaseUrl/auth/refresh-token");
    final refreshResponse = await http.post(refreshUrl, headers: {
      'Cookie': refreshToken,
      'Content-Type': 'application/json',
    });

    if (refreshResponse.statusCode == 200) {
      final newCookie = refreshResponse.headers['set-cookie'];
      final match = RegExp(r'accessToken=([^;]+)').firstMatch(newCookie ?? '');
      if (match != null) {
        box.write('token', match.group(1));
        return await updateComment(commentId, text, isRetrying: true);
      }
    } else {
      Get.offAll(() => const LoginScreen());
    }
    return false;
  }

  // ----------------------- DELETE COMMENT -----------------------
  Future<bool> deleteComment(String commentId,
      {bool isRetrying = false}) async {
    setLoading = true;
    final accessToken = box.read('token');
    final url = Uri.parse("$appBaseUrl/user/comment/$commentId");

    final headers = {
      'Cookie': 'accessToken=$accessToken',
      'Content-Type': 'application/json',
    };

    try {
      final response = await http.delete(url, headers: headers);
      debugPrint('Delete Comment Response: ${response.body}');

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        Get.snackbar("Comment Deleted", data['message'] ?? "Success",
            backgroundColor: kLightBlue, colorText: kLightWhite);
        return true;
      } else if (response.statusCode == 401 && !isRetrying) {
        return await _refreshTokenAndRetryDelete(commentId);
      } else {
        final error = apiErrorFromJson(response.body);
        Get.snackbar("Error", error.message,
            backgroundColor: kRed, colorText: kLightWhite);
      }
    } catch (e) {
      debugPrint("Delete Comment Error: $e");
    } finally {
      setLoading = false;
    }

    return false;
  }

  Future<Map<String, dynamic>?> fetchCommentById(String id) async {
    try {
      final token = box.read('token');

      final url = Uri.parse('$appBaseUrl/user/comments/$id');
      final response = await http.get(url, headers: {
        'Authorization': 'Bearer $token',
        'Content-Type': 'application/json',
      });
      if (response.statusCode == 200) {
        return jsonDecode(response.body)['comment'];
      }
    } catch (e) {
      debugPrint("Error fetching comment $id: $e");
    }
    return null;
  }

  Future<bool> _refreshTokenAndRetryDelete(String commentId) async {
    final refreshToken = box.read('refreshToken');
    if (refreshToken == null) {
      Get.offAll(() => const LoginScreen());
      return false;
    }

    final refreshUrl = Uri.parse("$appBaseUrl/auth/refresh-token");
    final refreshResponse = await http.post(refreshUrl, headers: {
      'Cookie': refreshToken,
      'Content-Type': 'application/json',
    });

    if (refreshResponse.statusCode == 200) {
      final newCookie = refreshResponse.headers['set-cookie'];
      final match = RegExp(r'accessToken=([^;]+)').firstMatch(newCookie ?? '');
      if (match != null) {
        box.write('token', match.group(1));
        return await deleteComment(commentId, isRetrying: true);
      }
    } else {
      Get.offAll(() => const LoginScreen());
    }

    return false;
  }
}
