import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:get/get.dart';
import 'package:graduation_project1/common/app_style.dart';
import 'package:graduation_project1/common/reusable_text.dart';
import 'package:graduation_project1/constants/constants.dart';
import 'package:graduation_project1/controllers/controllers.auth/login_controller.dart';
import 'package:graduation_project1/controllers/profile_controller.dart';
import 'package:graduation_project1/hooks/fetch_profile.dart';
import 'package:graduation_project1/views/profile/widgets/profile_tile.dart';

class ProfileScreen extends HookWidget {
  @override
  Widget build(BuildContext context) {
    final login = Get.put(LoginController());
    final profileController = Get.put(ProfileController());

    final profileHook = useFetchProfile();
    final user = profileHook.data?.user;

    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: kDarkBlue),
          onPressed: () => Get.back(),
        ),
        title: const Text('My Profile', style: TextStyle(color: kDarkBlue)),
        centerTitle: true,
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
                            backgroundImage: NetworkImage(user.imgUrl ??
                                'assets/images/default_avatar.png'),
                          ),
                          GestureDetector(
                            onTap: () async {
                              final base64Image = await profileController
                                  .pickAndConvertImageToBase64();
                              if (base64Image != null) {
                                await profileController.updateProfile(
                                  name: user.name,
                                  phoneNumber: user.phoneNumber,
                                  address: user.address,
                                  base64Image: base64Image,
                                );
                              }
                            },
                            child: Container(
                              padding: const EdgeInsets.all(6),
                              decoration: const BoxDecoration(
                                color: Colors.white,
                                shape: BoxShape.circle,
                              ),
                              child: const Icon(
                                Icons.camera_alt_outlined,
                                size: 16,
                                color: kDarkBlue,
                              ),
                            ),
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
                        onTap: () {},
                      ),
                      ProfileTile(
                        icon: CupertinoIcons.cube_box,
                        title: 'Orders',
                        onTap: () {},
                      ),
                      ProfileTile(
                        icon: Icons.control_point_duplicate_sharp,
                        title: 'Your Points',
                        onTap: () {},
                      ),
                      ProfileTile(
                        icon: Icons.headset_mic_sharp,
                        title: 'Contact Us',
                        onTap: () {},
                      ),
                      ProfileTile(
                        icon: Icons.help_outline,
                        title: 'Help & Support',
                        onTap: () {},
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
