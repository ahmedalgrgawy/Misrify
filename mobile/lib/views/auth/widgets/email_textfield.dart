import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:get/get.dart';
import 'package:graduation_project1/common/app_style.dart';
import 'package:graduation_project1/common/reusable_text.dart';
import 'package:graduation_project1/constants/constants.dart';
import 'package:graduation_project1/controllers/controllers.auth/login_controller.dart';
import 'package:graduation_project1/controllers/controllers.auth/registration_controller.dart';

class EmailTextfield extends StatelessWidget {
  const EmailTextfield({
    super.key,
    this.onEditingComplete,
    this.keyboardType,
    this.initialValue,
    this.controller,
    this.suffixIcon,
    required this.title,
    this.islogin = true,
  });

  final void Function()? onEditingComplete;
  final TextInputType? keyboardType;
  final String? initialValue;
  final String title;
  final TextEditingController? controller;
  final Widget? suffixIcon;
  final bool islogin;

  @override
  Widget build(BuildContext context) {
    final LoginController loginController = Get.find<LoginController>();
    final RegistrationController registrationController =
        Get.put(RegistrationController());

    return Obx(() {
      // Find an email-related error message
      String? errorMessage = islogin
          ? loginController.errors.firstWhereOrNull(
              (error) => error.toLowerCase().contains("email"),
            )
          : registrationController.fieldErrors["email"];

      return Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          ReusableText(
            text: title,
            style: appStyle(14, kBlue, FontWeight.w400),
          ),
          SizedBox(height: 10.h),
          TextFormField(
            cursorColor: kDarkBlue,
            textInputAction: TextInputAction.next,
            onEditingComplete: onEditingComplete,
            keyboardType: keyboardType ?? TextInputType.emailAddress,
            initialValue: initialValue,
            controller: controller,
            onChanged: (value) {
              // ✅ Corrected error removal
              if (islogin) {
                loginController.errors.removeWhere(
                    (error) => error.toLowerCase().contains("email"));
              } else {
                registrationController.fieldErrors
                    .remove("email"); // ✅ Fixed: Remove by key
                registrationController.fieldErrors
                    .refresh(); // ✅ Ensure UI updates
              }
            },
            validator: (value) {
              if (value == null || value.isEmpty) {
                return "Email is required";
              }
              return null;
            },
            style: appStyle(15, kDarkBlue, FontWeight.normal),
            decoration: InputDecoration(
              filled: true,
              fillColor: Kbackground,
              suffixIcon: suffixIcon,
              isDense: true,
              contentPadding:
                  EdgeInsets.symmetric(vertical: 10.h, horizontal: 12.w),
              errorText: errorMessage, // Show validation error under field
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
