import 'package:flutter/material.dart';
import 'package:graduation_project1/common/app_style.dart';
import 'package:graduation_project1/common/reusable_text.dart';
import 'package:graduation_project1/constants/constants.dart';

class SupportSection extends StatelessWidget {
  const SupportSection({
    super.key,
    required this.title,
    required this.discription,
  });
  final String title;
  final String discription;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          ReusableText(
            text: title,
            style: appStyle(18, KTextColor, FontWeight.w600),
          ),
          const SizedBox(height: 8),
          ReusableText(
            maxlines: 5,
            text: discription,
            style: appStyle(12, kGray, FontWeight.w400),
          ),
        ],
      ),
    );
  }
}
