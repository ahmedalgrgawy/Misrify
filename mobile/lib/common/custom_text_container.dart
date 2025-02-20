import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:graduation_project1/common/app_style.dart';
import 'package:graduation_project1/common/reusable_text.dart';
import 'package:graduation_project1/constants/constants.dart';

class CustomTextContainer extends StatelessWidget {
  const CustomTextContainer(
      {super.key,
      this.keyboardType,
      this.controller,
      this.onEditingComplete,
      this.obscureText,
      this.prefixIcon,
      this.suffixIcon,
      this.validator,
      this.hintText,
      this.maxlines,
      required this.title});

  final TextInputType? keyboardType;
  final TextEditingController? controller;
  final void Function()? onEditingComplete;
  final bool? obscureText;
  final Widget? prefixIcon;
  final Widget? suffixIcon;
  final String? Function(String?)? validator;
  final String? hintText;
  final int? maxlines;
  final String title;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        ReusableText(text: title, style: appStyle(14, kBlue, FontWeight.w400)),
        SizedBox(
          height: 5.h,
        ),
        TextFormField(
          maxLines: maxlines ?? 1,
          controller: controller,
          keyboardType: keyboardType,
          onEditingComplete: onEditingComplete,
          obscureText: obscureText ?? false,
          cursorHeight: 20.h,
          style: appStyle(14, kBlue, FontWeight.w400),
          validator: validator,
          decoration: InputDecoration(
              filled: true,
              fillColor: Kbackground,
              hintText: hintText,
              hintStyle: appStyle(11, kLightGray, FontWeight.normal),
              suffixIcon: suffixIcon,
              prefixIcon: prefixIcon,
              isDense: true,
              contentPadding:
                  EdgeInsets.symmetric(vertical: 10.h, horizontal: 12.w),
              errorBorder: OutlineInputBorder(
                  borderSide: const BorderSide(color: kRed, width: .5),
                  borderRadius: BorderRadius.all(Radius.circular(15.r))),
              focusedBorder: OutlineInputBorder(
                  borderSide: const BorderSide(color: kLightGray, width: .5),
                  borderRadius: BorderRadius.all(Radius.circular(15.r))),
              focusedErrorBorder: OutlineInputBorder(
                  borderSide: const BorderSide(color: kRed, width: .5),
                  borderRadius: BorderRadius.all(Radius.circular(15.r))),
              disabledBorder: OutlineInputBorder(
                  borderSide: const BorderSide(color: Kbackground, width: .5),
                  borderRadius: BorderRadius.all(Radius.circular(15.r))),
              enabledBorder: OutlineInputBorder(
                  borderSide: const BorderSide(color: Kbackground, width: .5),
                  borderRadius: BorderRadius.all(Radius.circular(15.r))),
              border: OutlineInputBorder(
                  borderSide: const BorderSide(color: Kbackground, width: .5),
                  borderRadius: BorderRadius.all(Radius.circular(15.r)))),
        ),
      ],
    );
  }
}
