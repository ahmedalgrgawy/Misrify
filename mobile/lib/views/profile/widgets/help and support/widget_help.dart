import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:graduation_project1/common/custom_appbar.dart';
import 'package:graduation_project1/constants/constants.dart';
import 'package:graduation_project1/views/profile/help_and_support_screen.dart';

class FAQPage extends StatelessWidget {
  const FAQPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Kbackground,
      appBar: CustomAppbar(
        title: 'Asked Questions',
        onpress: () {
          Get.back();
        },
      ),
      body: const SingleChildScrollView(child: FAQSection()),
    );
  }
}
