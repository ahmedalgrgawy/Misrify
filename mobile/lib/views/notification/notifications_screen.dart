import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:graduation_project1/common/app_style.dart';
import 'package:graduation_project1/common/reusable_text.dart';
import 'package:graduation_project1/constants/constants.dart';
import 'package:graduation_project1/controllers/notification_controller.dart';
import 'package:graduation_project1/views/notification/widgets/notification_tile.dart';

class NotificationsScreen extends StatelessWidget {
  const NotificationsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final NotificationController controller = Get.put(NotificationController());

    // Trigger fetch when screen loads
    controller.fetchNotifications();

    return Scaffold(
      appBar: AppBar(
        title: Center(
            child: ReusableText(
          text: "Notifications",
          style: appStyle(20, KTextColor, FontWeight.w600),
        )),
        backgroundColor: Kbackground,
        actions: [
          Obx(() => controller.notifications.isNotEmpty
              ? IconButton(
                  icon: const Icon(
                    CupertinoIcons.delete,
                    color: kRed,
                  ),
                  tooltip: 'Delete All',
                  onPressed: () {
                    Get.bottomSheet(
                      Container(
                        padding: const EdgeInsets.all(20),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius:
                              BorderRadius.vertical(top: Radius.circular(16)),
                        ),
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            ReusableText(
                              text: "Do you want to delete all notifications?",
                              style: appStyle(14, KTextColor, FontWeight.w600),
                            ),
                            const SizedBox(height: 16),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                              children: [
                                ElevatedButton(
                                  onPressed: () {
                                    controller
                                        .deleteAllNotificationsFromServer();
                                    Get.back(); // close the sheet
                                  },
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: kRed,
                                  ),
                                  child: ReusableText(
                                    text: "Yes",
                                    style: appStyle(
                                        12, Colors.white, FontWeight.w400),
                                  ),
                                ),
                                ElevatedButton(
                                    onPressed: () {
                                      Get.back(); // just close the sheet
                                    },
                                    style: ElevatedButton.styleFrom(
                                      backgroundColor: kLightGray,
                                    ),
                                    child: ReusableText(
                                        text: "No",
                                        style: appStyle(
                                            12, KTextColor, FontWeight.w400))),
                              ],
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                )
              : const SizedBox()),
        ],
      ),
      body: Obx(() {
        if (controller.isLoading.value) {
          return const Center(child: CircularProgressIndicator());
        }

        if (controller.notifications.isEmpty) {
          return Center(
            child: ReusableText(
              text: "No notifications available.",
              style: appStyle(20, kGray, FontWeight.w500),
            ),
          );
        }

        return ListView.builder(
          itemCount: controller.notifications.length,
          itemBuilder: (context, index) {
            final notif = controller.notifications[index];
            return NotificationTile(notification: notif);
          },
        );
      }),
    );
  }
}
