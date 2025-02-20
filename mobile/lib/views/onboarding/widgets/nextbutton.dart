import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:get/get.dart';
import 'package:graduation_project1/common/app_style.dart';
import 'package:graduation_project1/common/reusable_text.dart';
import 'package:graduation_project1/constants/constants.dart';
import 'package:graduation_project1/controllers/controllers.onboarding/onboarding_controller.dart';

class NextButton extends StatelessWidget {
  const NextButton({
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    final controller = Get.put((OnBoardingController()));

    return Obx(
      () => Positioned(
          right: 0,
          bottom: 0.h,
          child: TextButton(
            onPressed: () => OnBoardingController.instance.nextPage(),
            child: Row(
              children: [
                controller.currentPageIndex != 2
                    ? ReusableText(
                        text: "Next",
                        style: appStyle(15, kDarkBlue, FontWeight.w400),
                      )
                    : ReusableText(
                        text: "Let\'s Start",
                        style: appStyle(15, kDarkBlue, FontWeight.w400),
                      ),
                SizedBox(width: 5.w),
                const Icon(
                  CupertinoIcons.arrow_right,
                  color: kDarkBlue,
                  size: 15,
                )
              ],
            ),
          )),
    );
  }
}
