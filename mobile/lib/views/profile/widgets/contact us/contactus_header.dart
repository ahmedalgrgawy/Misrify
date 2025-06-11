import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:graduation_project1/common/app_style.dart';
import 'package:graduation_project1/common/reusable_text.dart';
import 'package:graduation_project1/constants/constants.dart';

class ContactUsHeader extends StatelessWidget {
  const ContactUsHeader({
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.fromLTRB(16.w, 10.h, 16.w, 15.h),
      color: kDarkBlue,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          ReusableText(
              text: 'Contact Us',
              style: appStyle(24, Colors.white, FontWeight.bold)),
          SizedBox(
            height: 15.h,
          ),
          ReusableText(
              text:
                  'Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s.',
              maxlines: 4,
              style: appStyle(12, kLightGray, FontWeight.w400)),
        ],
      ),
    );
  }
}
