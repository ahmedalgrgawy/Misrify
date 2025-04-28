import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:graduation_project1/common/app_style.dart';
import 'package:graduation_project1/common/reusable_text.dart';
import 'package:graduation_project1/constants/constants.dart';
import 'package:lottie/lottie.dart';

class LoadingWidget extends StatelessWidget {
  const LoadingWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: width,
      height: height,
      child: Column(
        children: [
          Image.asset("assets/icons/emptypage.png",
              width: width, height: height / 3),
          ReusableText(
            text: "search on products ",
            style: appStyle(16, Colors.black87, FontWeight.w400),
          ),
        ],
      ),
    );
  }
}
