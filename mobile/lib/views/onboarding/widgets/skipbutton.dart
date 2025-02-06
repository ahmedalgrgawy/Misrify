import 'package:flutter/material.dart';
import 'package:graduation_project1/common/app_style.dart';
import 'package:graduation_project1/common/reusable_text.dart';
import 'package:graduation_project1/constants/constants.dart';
import 'package:graduation_project1/controllers/controllers.onboarding/onboarding_controller.dart';

class SkipButton extends StatelessWidget {
  const SkipButton({
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    return Positioned(
        top: 35,
        right: 0,
        child: TextButton(
          onPressed: () => OnBoardingController.instance.skipPage(),
          child: ReusableText(
              text: 'Skip', style: appStyle(15, kBlue, FontWeight.w400)),
        ));
  }
}
