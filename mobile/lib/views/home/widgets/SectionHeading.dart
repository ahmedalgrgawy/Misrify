import 'package:flutter/material.dart';
import 'package:graduation_project1/common/app_style.dart';
import 'package:graduation_project1/common/reusable_text.dart';
import 'package:graduation_project1/constants/constants.dart';

class SectionHeading extends StatelessWidget {
  final String title, buttontitle;
  final bool showButton;
  final VoidCallback? onPress;
  final EdgeInsetsGeometry padd;

  const SectionHeading(
      {super.key,
      required this.title,
      this.buttontitle = 'See All',
      this.showButton = true,
      this.onPress,
      this.padd = const EdgeInsets.symmetric(vertical: 8, horizontal: 14)});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: padd,
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          ReusableText(
              text: title, style: appStyle(16, KNavyBlack, FontWeight.w500)),
          if (showButton)
            TextButton(
                onPressed: onPress,
                child: ReusableText(
                    text: buttontitle,
                    style: appStyle(12, KblueOcean, FontWeight.w500))),
        ],
      ),
    );
  }
}
