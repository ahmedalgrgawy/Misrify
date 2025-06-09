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
  String timeAgo(DateTime date) {
    final now = DateTime.now();
    final diff = now.difference(date);
    if (diff.inMinutes < 1) return 'Just now';
    if (diff.inMinutes < 60) return '${diff.inMinutes} mins ago';
    if (diff.inHours < 24) return '${diff.inHours} hours ago';
    if (diff.inDays < 7) return '${diff.inDays} days ago';
    return '${date.day}/${date.month}/${date.year}';
  }

  @override
  Widget build(BuildContext context) {
    final controller = Get.find<NotificationController>();
    final borderColor = notification.isRead ? kLightGray : Knavbarlabels;

    return Container(
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
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  ReusableText(
                    text: notification.sender,
                    style: appStyle(18, KTextColor, FontWeight.w500),
                  ),
                  SizedBox(
                    width: 8.w,
                  ),
                  ReusableText(
                    text: timeAgo(notification.createdAt),
                    style:
                        appStyle(13, kGray.withOpacity(0.8), FontWeight.w400),
                  ),
                ],
              ),
              InkWell(
                onTap: () {
                  controller.deleteNotificationFromServer(notification.id);
                },
                child: Icon(
                  Icons.close,
                  color: Colors.grey.shade700,
                  size: 22,
                ),
              )
            ],
          ),
          SizedBox(height: 10.h),
          ReusableText(
            text: notification.content,
            maxlines: 4,
            style: appStyle(13, kGray, FontWeight.w400),
          ),
          SizedBox(height: 10.h),
          InkWell(
            onTap: () {
              controller.markAsRead(notification.id);
            },
            child: ReusableText(
                text: "Mark as read",
                style: appStyle(12, KTextColor, FontWeight.w600)),
          )
        ],
      ),
    );
  }
}
