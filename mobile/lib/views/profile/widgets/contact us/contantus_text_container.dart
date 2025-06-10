import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:get/get.dart';
import 'package:graduation_project1/common/app_style.dart';
import 'package:graduation_project1/common/reusable_text.dart';
import 'package:graduation_project1/constants/constants.dart';
import 'package:graduation_project1/controllers/contactus_controller.dart';

class ContantusTextContainer extends StatelessWidget {
  const ContantusTextContainer({
    super.key,
    this.keyboardType,
    this.controller,
    this.onEditingComplete,
    this.obscureText = false,
    this.prefixIcon,
    this.maxliens = 1,
    this.hinttext,
    required this.title,
    required this.fieldName, // ✅ Field name for error mapping
  });

  final TextInputType? keyboardType;
  final TextEditingController? controller;
  final void Function()? onEditingComplete;
  final bool obscureText;
  final Widget? prefixIcon;
  final String? hinttext;
  final String title;
  final int? maxliens;
  final String fieldName; // ✅ Field name to check validation errors

  @override
  Widget build(BuildContext context) {
    final ContactusController contactusController =
        Get.put(ContactusController());

    return Obx(() {
      // ✅ Get the error message for the specific field
      String? errorMessage = contactusController.fieldErrors[fieldName];

      return Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          ReusableText(
              text: title, style: appStyle(14, kBlue, FontWeight.w400)),
          SizedBox(height: 5.h),
          TextFormField(
            controller: controller,
            maxLines: maxliens,
            keyboardType: keyboardType,
            onEditingComplete: onEditingComplete,
            obscureText: obscureText,
            style: appStyle(14, kBlue, FontWeight.w400),
            onChanged: (value) {
              contactusController.fieldErrors.remove(fieldName);
            },
            decoration: InputDecoration(
              filled: true,
              hintText: hinttext,
              hintStyle: appStyle(14, kLightGray, FontWeight.w400),
              fillColor: kLightWhite.withOpacity(0.45),
              prefixIcon: prefixIcon,
              isDense: true,
              contentPadding:
                  EdgeInsets.symmetric(vertical: 10.h, horizontal: 12.w),
              errorText: errorMessage, // ✅ Show validation error under field
              border: OutlineInputBorder(
                borderSide: BorderSide(
                    color: errorMessage != null ? kRed : Kbackground,
                    width: .5),
              ),
              enabledBorder: OutlineInputBorder(
                borderSide: BorderSide(
                    color: errorMessage != null ? kRed : Kbackground,
                    width: .5),
              ),
              focusedBorder: OutlineInputBorder(
                borderSide: BorderSide(
                    color: errorMessage != null ? kRed : kLightGray, width: .5),
              ),
              errorBorder: OutlineInputBorder(
                borderSide: BorderSide(color: kRed, width: .5),
              ),
              focusedErrorBorder: OutlineInputBorder(
                borderSide: BorderSide(color: kRed, width: .5),
              ),
            ),
          ),
        ],
      );
    });
  }
}
