import 'dart:convert';
import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';
import 'package:http/http.dart' as http;
import 'package:graduation_project1/constants/constants.dart';
import 'package:graduation_project1/models/notification_model.dart';
import 'package:graduation_project1/views/auth/login_Screen.dart';

class NotificationController extends GetxController {
  final box = GetStorage();
  RxBool isLoading = false.obs;
  RxInt unreadCount = 0.obs;
  RxList<Notifications> notifications = <Notifications>[].obs;

  Future<void> fetchNotifications() async {
    isLoading.value = true;

    final accessToken = box.read('token');
    if (accessToken == null) {
      Get.offAll(() => const LoginScreen());
      return;
    }

    final url = Uri.parse('$appBaseUrl/user/notification');
    final headers = {
      'Content-Type': 'application/json',
      'Cookie': 'accessToken=$accessToken',
    };

    try {
      final response = await http.get(url, headers: headers);
      final decoded = jsonDecode(response.body);

      if (response.statusCode == 200 &&
          decoded is Map<String, dynamic> &&
          decoded['notifications'] is List) {
        final data = List<Map<String, dynamic>>.from(decoded['notifications']);
        final notifList =
            data.map((json) => Notifications.fromJson(json)).toList();
        notifList.sort((a, b) {
          if (a.isRead == b.isRead) return 0;
          return a.isRead ? 1 : -1; // unread (false) comes before read (true)
        });
        notifications.value = notifList;

        unreadCount.value = notifList.where((notif) => !notif.isRead).length;
      } else if (response.statusCode == 401) {
        await _refreshTokenAndRetry();
      }
    } catch (e) {
      print("❌ Error fetching notifications: $e");
    } finally {
      isLoading.value = false;
    }
  }

  Future<void> markAsRead(String id) async {
    final accessToken = box.read('token');
    if (accessToken == null) return;

    final url = Uri.parse('$appBaseUrl/user/notification/$id');
    final headers = {
      'Content-Type': 'application/json',
      'Cookie': 'accessToken=$accessToken',
    };

    try {
      final res = await http.put(url, headers: headers); // PATCH method
      if (res.statusCode == 200) {
        final index = notifications.indexWhere((n) => n.id == id);
        if (index != -1 && !notifications[index].isRead) {
          notifications[index] = Notifications(
            id: notifications[index].id,
            receivers: notifications[index].receivers,
            sender: notifications[index].sender,
            content: notifications[index].content,
            type: notifications[index].type,
            isRead: true,
            createdAt: notifications[index].createdAt,
            updatedAt: notifications[index].updatedAt,
            v: notifications[index].v,
          );

          unreadCount.value =
              notifications.where((notif) => !notif.isRead).length;
        }
      } else {
        print("❌ Failed to mark as read on server");
      }
    } catch (e) {
      print("❌ Mark-as-read error: $e");
    }
  }

  Future<void> deleteNotificationFromServer(String id) async {
    final accessToken = box.read('token');
    if (accessToken == null) return;

    final url = Uri.parse('$appBaseUrl/user/notification/$id');
    final headers = {
      'Content-Type': 'application/json',
      'Cookie': 'accessToken=$accessToken',
    };

    try {
      final res = await http.delete(url, headers: headers);
      if (res.statusCode == 200) {
        notifications.removeWhere((n) => n.id == id);
        unreadCount.value =
            notifications.where((notif) => !notif.isRead).length;
      } else {
        print("❌ Failed to delete notification from server");
      }
    } catch (e) {
      print("❌ Delete error: $e");
    }
  }

  Future<void> deleteAllNotificationsFromServer() async {
    final accessToken = box.read('token');
    if (accessToken == null) return;

    final url = Uri.parse('$appBaseUrl/user/notification');
    final headers = {
      'Content-Type': 'application/json',
      'Cookie': 'accessToken=$accessToken',
    };

    try {
      final res = await http.delete(url, headers: headers);
      if (res.statusCode == 200) {
        notifications.clear();
        unreadCount.value = 0;
      } else {
        print("❌ Failed to delete all notifications from server");
      }
    } catch (e) {
      print("❌ Delete all error: $e");
    }
  }

  Future<void> _refreshTokenAndRetry() async {
    final refreshToken = box.read('refreshToken');
    if (refreshToken == null) {
      Get.offAll(() => const LoginScreen());
      return;
    }

    final refreshUrl = Uri.parse('$appBaseUrl/auth/refresh-token');
    final refreshResponse = await http.post(
      refreshUrl,
      headers: {
        'Cookie': refreshToken,
        'Content-Type': 'application/json',
      },
    );

    if (refreshResponse.statusCode == 200) {
      final newCookie = refreshResponse.headers['set-cookie'];
      final match = RegExp(r'accessToken=([^;]+)').firstMatch(newCookie ?? '');
      if (match != null) {
        final newToken = match.group(1);
        box.write('token', newToken);
        await fetchNotifications();
      }
    } else {
      Get.offAll(() => const LoginScreen());
    }
  }
}
