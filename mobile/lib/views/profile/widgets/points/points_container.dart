import 'package:flutter/material.dart';
import 'package:graduation_project1/common/app_style.dart';
import 'package:graduation_project1/common/reusable_text.dart';
import 'package:graduation_project1/constants/constants.dart';

class PointsContainer extends StatelessWidget {
  const PointsContainer(
      {super.key, required this.quantity, required this.title});
  final int quantity;
  final String title;
  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
          color: Colors.white,
          border: Border.all(color: Knavbarlabels),
          borderRadius: BorderRadius.circular(8)),
      child: Padding(
        padding: const EdgeInsets.all(10.0),
        child: Column(
          children: [
            ReusableText(
                text: quantity.toString(),
                style: appStyle(20, KTextColor, FontWeight.w600)),
            ReusableText(
                text: title, style: appStyle(15, kGray, FontWeight.w400)),
          ],
        ),
      ),
    );
  }
}
