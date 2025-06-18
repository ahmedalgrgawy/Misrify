import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:get/get.dart';
import 'package:graduation_project1/common/app_style.dart';
import 'package:graduation_project1/common/custom_button.dart';
import 'package:graduation_project1/common/reusable_text.dart';
import 'package:graduation_project1/constants/constants.dart';
import 'package:graduation_project1/views/auth/login_Screen.dart';
import 'package:lottie/lottie.dart';

class LoginRedirect extends StatelessWidget {
  const LoginRedirect({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: Center(
            child: ReusableText(
                text: 'Please log in to access this page',
                style: appStyle(12, kDarkBlue, FontWeight.w500))),
      ),
      body: Column(
        children: [
          Container(
            width: width,
            child: LottieBuilder.asset("assets/anime/delivery.json",
                width: width, height: height / 2),
          ),
          CustomButton(
            onTap: () {
              Get.to(() => const LoginScreen(),
                  transition: Transition.cupertino,
                  duration: Duration(milliseconds: 900));
            },
            text: 'L O G I N ',
            btnColor: kGray,
            btnHeight: 45.h,
            btnWidth: 200.w,
          )
        ],
      ),
    );
  }
}
