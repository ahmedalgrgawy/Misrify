import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:get/get.dart';
import 'package:graduation_project1/common/app_style.dart';
import 'package:graduation_project1/common/reusable_text.dart';
import 'package:graduation_project1/constants/constants.dart';
import 'package:graduation_project1/controllers/controllers.auth/registration_controller.dart';

class CustomTextContainer extends StatelessWidget {
  const CustomTextContainer({
    super.key,
    this.keyboardType,
    this.controller,
    this.onEditingComplete,
    this.obscureText = false,
    this.prefixIcon,
    this.suffixIcon,
    required this.title,
    required this.fieldName, // ✅ Field name for error mapping
  });

  final TextInputType? keyboardType;
  final TextEditingController? controller;
  final void Function()? onEditingComplete;
  final bool obscureText;
  final Widget? prefixIcon;
  final Widget? suffixIcon;
  final String title;
  final String fieldName; // ✅ Field name to check validation errors

  @override
  Widget build(BuildContext context) {
    final RegistrationController registrationController =
        Get.put(RegistrationController());

    return Obx(() {
      // ✅ Get the error message for the specific field
      String? errorMessage = registrationController.fieldErrors[fieldName];

      return Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          ReusableText(
              text: title, style: appStyle(14, kBlue, FontWeight.w400)),
          SizedBox(height: 5.h),
          TextFormField(
            controller: controller,
            keyboardType: keyboardType,
            onEditingComplete: onEditingComplete,
            obscureText: obscureText,
            style: appStyle(14, kBlue, FontWeight.w400),
            onChanged: (value) {
              registrationController.fieldErrors.remove(fieldName);
            },
            decoration: InputDecoration(
              filled: true,
              fillColor: Kbackground,
              suffixIcon: suffixIcon,
              prefixIcon: prefixIcon,
              isDense: true,
              contentPadding:
                  EdgeInsets.symmetric(vertical: 10.h, horizontal: 12.w),
              errorText: errorMessage, // ✅ Show validation error under field
              border: OutlineInputBorder(
                borderSide: BorderSide(
                    color: errorMessage != null ? kRed : Kbackground,
                    width: .5),
                borderRadius: BorderRadius.all(Radius.circular(15.r)),
              ),
              enabledBorder: OutlineInputBorder(
                borderSide: BorderSide(
                    color: errorMessage != null ? kRed : Kbackground,
                    width: .5),
                borderRadius: BorderRadius.all(Radius.circular(15.r)),
              ),
              focusedBorder: OutlineInputBorder(
                borderSide: BorderSide(
                    color: errorMessage != null ? kRed : kLightGray, width: .5),
                borderRadius: BorderRadius.all(Radius.circular(15.r)),
              ),
              errorBorder: OutlineInputBorder(
                borderSide: BorderSide(color: kRed, width: .5),
                borderRadius: BorderRadius.all(Radius.circular(15.r)),
              ),
              focusedErrorBorder: OutlineInputBorder(
                borderSide: BorderSide(color: kRed, width: .5),
                borderRadius: BorderRadius.all(Radius.circular(15.r)),
              ),
            ),
          ),
        ],
      );
    });
  }
}
