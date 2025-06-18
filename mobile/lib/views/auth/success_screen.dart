import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:get/get.dart';
import 'package:graduation_project1/common/app_style.dart';
import 'package:graduation_project1/common/custom_button.dart';
import 'package:graduation_project1/common/reusable_text.dart';
import 'package:graduation_project1/constants/constants.dart';
import 'package:graduation_project1/views/auth/login_Screen.dart';

class SuccessScreen extends StatelessWidget {
  const SuccessScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: kLightWhite,
      body: Padding(
        padding: EdgeInsets.symmetric(horizontal: 30.w, vertical: 250.h),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Image.asset('assets/icons/done.png'),
            SizedBox(
              height: 30.h,
            ),
            ReusableText(
                text: 'Password Changed Successfully ',
                maxlines: 2,
                align: TextAlign.center,
                SoftWrap: true,
                style: appStyle(24, kDarkest, FontWeight.w700)),
            SizedBox(
              height: 30.h,
            ),
            CustomButton(
              onTap: () {
                Get.to(const LoginScreen());
              },
              text: 'Back to login',
              textcolor: Kbackground,
              btnColor: kLightBlue,
              btnHeight: 48.h,
              btnWidth: width,
            ),
          ],
        ),
      ),
    );
  }
}
