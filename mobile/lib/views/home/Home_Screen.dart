import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:get/get.dart';
import 'package:graduation_project1/common/custom_button.dart';
import 'package:graduation_project1/constants/constants.dart';
import 'package:graduation_project1/controllers/controllers.auth/login_controller.dart';
import 'package:graduation_project1/views/home/widgets/Appbar.dart';

class HomeScreen extends StatelessWidget {
  static const String routeName = "Home_Screen";

  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final controller = Get.put(LoginController());

    return SafeArea(
        child: Scaffold(
      appBar: Appbar(title: 'Misrify'),
      body: CustomButton(
        onTap: () {
          controller.logout();
        },
        text: 'logout',
        textcolor: Kbackground,
        btnColor: kRed,
        btnHeight: 48.h,
        btnWidth: width,
      ),
    ));
  }
}
