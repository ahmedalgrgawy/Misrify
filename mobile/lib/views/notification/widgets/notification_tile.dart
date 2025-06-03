import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:get/get.dart';
import 'package:graduation_project1/common/app_style.dart';
import 'package:graduation_project1/common/reusable_text.dart';
import 'package:graduation_project1/constants/constants.dart';
import 'package:graduation_project1/controllers/notification_controller.dart';
import 'package:graduation_project1/models/notification_model.dart';
import 'package:intl/intl.dart';

class NotificationTile extends StatelessWidget {
  const NotificationTile({super.key, required this.notification});

  final Notifications notification;

  @override
  Widget build(BuildContext context) {
    final controller = Get.find<NotificationController>();
    final borderColor = notification.isRead ? kLightGray : Knavbarlabels;

    return GestureDetector(
      onTap: () => controller.markAsRead(notification.id),
      onLongPress: () {
        showModalBottomSheet(
          context: context,
          builder: (_) {
            return Padding(
              padding: const EdgeInsets.all(16),
              child: ElevatedButton.icon(
                onPressed: () {
                  controller.deleteNotificationFromServer(notification.id);
                  Navigator.pop(context);
                },
                icon: const Icon(
                  Icons.delete,
                  color: Colors.white,
                ),
                label: ReusableText(
                  text: "Delete Notification",
                  style: appStyle(12, Colors.white, FontWeight.w400),
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: kNavy,
                ),
              ),
            );
          },
        );
      },
      child: Container(
        margin: EdgeInsets.symmetric(vertical: 8.h, horizontal: 16.w),
        padding: EdgeInsets.all(12.r),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(12.r),
          border: Border.all(color: borderColor),
          boxShadow: [
            BoxShadow(
              color: kLightGray,
              blurRadius: 6,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            ReusableText(
              text: notification.content,
              maxlines: 4,
              style: appStyle(14, KTextColor, FontWeight.w500),
            ),
            SizedBox(height: 6.h),
            ReusableText(
              text: "From: ${notification.sender}",
              style: appStyle(12, kGray, FontWeight.w400),
            ),
            SizedBox(height: 4.h),
            ReusableText(
              text: DateFormat.yMMMEd().add_jm().format(notification.createdAt),
              style: appStyle(11, kLightGray, FontWeight.w400),
            ),
          ],
        ),
      ),
    );
  }
}
