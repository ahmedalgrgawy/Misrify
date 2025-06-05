// ignore_for_file: must_be_immutable

import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:get/get.dart';

import 'package:graduation_project1/common/app_style.dart';
import 'package:graduation_project1/common/reusable_text.dart';
import 'package:graduation_project1/constants/constants.dart';
import 'package:graduation_project1/controllers/cart_controller.dart';
import 'package:graduation_project1/controllers/notification_controller.dart';
import 'package:graduation_project1/views/cart/cart_screen.dart';
import 'package:graduation_project1/views/notification/notifications_screen.dart';
import 'package:graduation_project1/views/profile/profile_screen.dart';

class Appbar extends StatelessWidget implements PreferredSizeWidget {
  final String title;
  final Widget? child;
  final bool showBackArrow;
  final double? height;
  final EdgeInsetsGeometry? padding;

  Appbar({
    super.key,
    required this.title,
    this.child,
    this.padding = const EdgeInsets.all(10),
    this.showBackArrow = false,
    this.height,
  });

  @override
  Widget build(BuildContext context) {
    final cartController = Get.put(CartController());
    final notificationController = Get.put(NotificationController());

    return Container(
      height: height ?? 80.h,
      color: Kbackground,
      padding: padding,
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          GestureDetector(
            onTap: () => Get.to(() => ProfileScreen()),
            child: CircleAvatar(
              backgroundColor: Colors.white,
              child: const Icon(Icons.person),
              radius: 15.r,
            ),
          ),
          ReusableText(
            text: title,
            style: appStyle(20, kDarkBlue, FontWeight.w700),
          ),
          Row(
            children: [
              Obx(() {
                final count = notificationController.unreadCount.value;
                return InkWell(
                  onTap: () => Get.to(() => const NotificationsScreen()),
                  child: count > 0
                      ? Badge(
                          backgroundColor: Colors.amber,
                          label: Text(
                            '$count',
                            style: const TextStyle(color: Colors.black),
                          ),
                          child: const Icon(
                            CupertinoIcons.bell,
                            color: kBlue,
                            size: 25,
                          ),
                        )
                      : const Icon(
                          CupertinoIcons.bell,
                          color: kBlue,
                          size: 25,
                        ),
                );
              }),
              SizedBox(width: 7.w),
              Obx(() {
                final count = cartController.itemCount.value;
                return InkWell(
                  onTap: () => Get.to(() => const CartScreen(fromAppBar: true)),
                  child: count > 0
                      ? Badge(
                          label: Text('$count'),
                          child: const Icon(
                            Icons.shopping_cart_outlined,
                            color: kBlue,
                            size: 30,
                          ),
                        )
                      : const Icon(
                          Icons.shopping_cart_outlined,
                          color: kBlue,
                          size: 30,
                        ),
                );
              }),
            ],
          ),
        ],
      ),
    );
  }

  @override
  Size get preferredSize => Size.fromHeight(height ?? 80.h);
}
