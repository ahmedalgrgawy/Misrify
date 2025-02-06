import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:graduation_project1/common/app_style.dart';
import 'package:graduation_project1/common/reusable_text.dart';
import 'package:graduation_project1/constants/constants.dart';

class EmailTextfield extends StatelessWidget {
  const EmailTextfield(
      {super.key,
      this.onEditingComplete,
      this.keyboardType,
      this.initialValue,
      this.controller,
      this.suffixIcon,
      required this.title});

  final void Function()? onEditingComplete;
  final TextInputType? keyboardType;
  final String? initialValue;
  final String title;
  final TextEditingController? controller;
  final Widget? suffixIcon;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        ReusableText(text: title, style: appStyle(14, kBlue, FontWeight.w400)),
        SizedBox(
          height: 10.h,
        ),
        TextFormField(
          cursorColor: kDarkBlue,
          textInputAction: TextInputAction.next,
          onEditingComplete: onEditingComplete,
          keyboardType: keyboardType ?? TextInputType.emailAddress,
          initialValue: initialValue,
          controller: controller,
          validator: (value) {
            if (value!.isEmpty) {
              return "Please enter valid data";
            } else {
              return null;
            }
          },
          style: appStyle(15, kDarkBlue, FontWeight.normal),
          decoration: InputDecoration(
              filled: true,
              fillColor: Kbackground,
              suffixIcon: suffixIcon,
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
