import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:get/get.dart';
import 'dart:convert';

import 'package:graduation_project1/common/app_style.dart';
import 'package:graduation_project1/common/custom_appbar.dart';
import 'package:graduation_project1/common/reusable_text.dart';
import 'package:graduation_project1/constants/constants.dart';
import 'package:graduation_project1/controllers/controllers.auth/login_controller.dart';
import 'package:graduation_project1/hooks/fetch_profile.dart';
import 'package:graduation_project1/views/entrypoint.dart';
import 'package:graduation_project1/views/orders/allOrders_screen.dart';
import 'package:graduation_project1/views/profile/contactus.dart';
import 'package:graduation_project1/views/profile/edit_profile_Screen.dart';
import 'package:graduation_project1/views/profile/points_screen.dart';
import 'package:graduation_project1/views/profile/widgets/help%20and%20support/widget_help.dart';
import 'package:graduation_project1/views/profile/widgets/profile_tile.dart';

class ProfileScreen extends HookWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final login = Get.put(LoginController());
    final profileHook = useFetchProfile();
    final user = profileHook.data?.user;

    return Scaffold(
      appBar: CustomAppbar(
        title: 'My Profile',
        onpress: () {
          Get.to(MainScreen());
        },
      ),
      body: user == null
          ? const Center(child: CircularProgressIndicator())
          : Column(
              children: [
                const SizedBox(height: 10),
                Padding(
                  padding:
                      const EdgeInsets.only(left: 22.0, bottom: 22, right: 20),
                  child: Row(
                    children: [
                      Stack(
                        alignment: Alignment.bottomRight,
                        children: [
                          CircleAvatar(
                            radius: 43,
                            backgroundImage: user.imgUrl != null
                                ? (user.imgUrl!.startsWith('data:image')
                                        ? MemoryImage(base64Decode(
                                            user.imgUrl!.split(',').last))
                                        : NetworkImage(user.imgUrl!))
                                    as ImageProvider
                                : const AssetImage(
                                    'assets/images/default_avatar.png'),
                          ),
                        ],
                      ),
                      const SizedBox(width: 10),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const SizedBox(height: 12),
                          ReusableText(
                            text: user.name,
                            style: appStyle(14, kDarkBlue, FontWeight.w600),
                          ),
                          const SizedBox(height: 4),
                          ReusableText(
                            text: user.email,
                            style: appStyle(14, kLightGray, FontWeight.w500),
                          ),
                          const SizedBox(height: 30),
                        ],
                      ),
                    ],
                  ),
                ),
                Container(
                  margin: const EdgeInsets.symmetric(horizontal: 20),
                  padding: const EdgeInsets.symmetric(vertical: 10),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(24),
                  ),
                  child: Column(
                    children: [
                      ProfileTile(
                        icon: Icons.account_circle_outlined,
                        title: 'Edit profile',
                        onTap: () {
                          Get.to(() => const EditProfile())?.then((_) {
                            // Trigger refetch after returning from edit screen
                            profileHook.refetch?.call();
                          });
                        },
                      ),
                      ProfileTile(
                        icon: CupertinoIcons.cube_box,
                        title: 'Orders',
                        onTap: () {
                          Get.to(() => const AllOrdersScreen());
                        },
                      ),
                      ProfileTile(
                        icon: Icons.control_point_duplicate_sharp,
                        title: 'Your Points',
                        onTap: () {
                          Get.to(() => const PointsScreen());
                        },
                      ),
                      ProfileTile(
                          icon: Icons.headset_mic_sharp,
                          title: 'Contact Us',
                          onTap: () {
                            Get.to(() => const ContactUsScreen());
                          }),
                      ProfileTile(
                        icon: Icons.help_outline,
                        title: 'Help & Support',
                        onTap: () {
                          Get.to(() => const FAQPage());
                        },
                      ),
                      ProfileTile(
                        icon: Icons.logout,
                        title: 'Sign out',
                        onTap: () {
                          login.logout();
                        },
                        iconColor: Colors.red,
                        textColor: Colors.red,
                        showDivider: false,
                      ),
                    ],
                  ),
                ),
              ],
            ),
    );
  }
}
