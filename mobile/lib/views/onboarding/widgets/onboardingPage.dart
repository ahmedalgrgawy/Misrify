import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:flutter_svg/svg.dart';
import 'package:graduation_project1/common/app_style.dart';
import 'package:graduation_project1/common/reusable_text.dart';
import 'package:graduation_project1/constants/constants.dart';

class OnBoardingPage extends StatelessWidget {
  const OnBoardingPage({
    super.key,
    required this.title,
    required this.subTitle,
    required this.image,
  });
  final String image;
  final String title, subTitle;
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.symmetric(horizontal: 20.w),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          SvgPicture.asset(image),
          const SizedBox(
            height: 50,
          ),
          Text(title, style: appStyle(27, kDarkBlue, FontWeight.w600)),
          const SizedBox(
            height: 10,
          ),
          ReusableText(
              text: subTitle,
              maxlines: 5,
              align: TextAlign.center,
              SoftWrap: true,
              style: appStyle(14, kLightBlue, FontWeight.w400)),
        ],
      ),
    );
  }
}
