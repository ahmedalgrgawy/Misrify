// ignore_for_file: must_be_immutable

import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:graduation_project1/constants/constants.dart';

class BackGroundContainer extends StatelessWidget {
  BackGroundContainer({super.key, required this.child, required this.color});
  Color color;
  Widget child;
  @override
  Widget build(BuildContext context) {
    return Container(
      width: width,
      height: height,
      decoration: BoxDecoration(
        color: color,
        borderRadius: BorderRadius.only(
            topLeft: Radius.circular(40.r), topRight: Radius.circular(40.r)),
      ),
      child: child,
    );
  }
}
