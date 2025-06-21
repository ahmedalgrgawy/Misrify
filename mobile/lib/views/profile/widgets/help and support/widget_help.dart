import 'package:flutter/material.dart';
<<<<<<< HEAD
import 'package:graduation_project1/common/app_style.dart';
import 'package:graduation_project1/common/reusable_text.dart';
=======
import 'package:get/get.dart';
import 'package:graduation_project1/common/custom_appbar.dart';
>>>>>>> clean-branch
import 'package:graduation_project1/constants/constants.dart';
import 'package:graduation_project1/views/profile/help_and_support_screen.dart';

class FAQPage extends StatelessWidget {
  const FAQPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Kbackground,
<<<<<<< HEAD
      appBar: AppBar(
        title: ReusableText(
          text: 'Asked Questions',
          style: appStyle(19, Colors.white, FontWeight.w500),
        ),
        backgroundColor: kDarkBlue,
        foregroundColor: Colors.white,
=======
      appBar: CustomAppbar(
        title: 'Asked Questions',
        onpress: () {
          Get.back();
        },
>>>>>>> clean-branch
      ),
      body: const SingleChildScrollView(child: FAQSection()),
    );
  }
}
