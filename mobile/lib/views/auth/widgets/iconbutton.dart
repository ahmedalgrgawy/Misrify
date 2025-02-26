// ignore_for_file: prefer_const_constructors_in_immutables

import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class LoginIconbutton extends StatelessWidget {
  LoginIconbutton({super.key, required this.image, this.ontap});

  final String image;
  final void Function()? ontap;
  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: ontap,
      child: CircleAvatar(
        backgroundColor: const Color(0xffDFDFDF),
        radius: 20.r,
        child: Padding(
          padding: const EdgeInsets.all(5.0),
          child: Image.asset(
            image,
            fit: BoxFit.fill,
          ),
        ),
      ),
    );
  }
}
