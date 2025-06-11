import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:graduation_project1/common/app_style.dart';
import 'package:graduation_project1/common/reusable_text.dart';
import 'package:graduation_project1/constants/constants.dart';

class EditprofileTextContainer extends StatelessWidget {
  const EditprofileTextContainer({
    super.key,
    required this.label,
    this.controller,
    this.obscureText = false,
    this.keyboardType,
    this.errorText,
  });

  final String label;
  final TextEditingController? controller;
  final bool obscureText;
  final TextInputType? keyboardType;
  final String? errorText;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        ReusableText(text: label, style: appStyle(14, kBlue, FontWeight.w400)),
        const SizedBox(height: 6),
        Container(
          decoration: BoxDecoration(
            color: const Color(0xFFF5F5F5),
            borderRadius: BorderRadius.circular(8),
            border: Border.all(
              color: errorText != null ? Colors.red : Colors.grey.shade300,
            ),
          ),
          child: TextFormField(
            controller: controller,
            obscureText: obscureText,
            keyboardType: keyboardType,
            style: appStyle(14, kBlue, FontWeight.w400),
            decoration: InputDecoration(
              errorText: errorText,
              filled: true,
              fillColor: kLightWhite.withOpacity(0.45),
              border: OutlineInputBorder(
                borderSide: BorderSide(color: Kbackground, width: .5),
              ),
              enabledBorder: OutlineInputBorder(
                borderSide: BorderSide(color: Kbackground, width: .5),
              ),
              focusedBorder: OutlineInputBorder(
                borderSide: BorderSide(
                    color: errorText != null ? Colors.red : kLightGray,
                    width: .5),
              ),
              contentPadding:
                  EdgeInsets.symmetric(vertical: 10.h, horizontal: 12.w),
            ),
          ),
        ),
      ],
    );
  }
}
