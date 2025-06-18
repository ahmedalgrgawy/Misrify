import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:get/get.dart';
import 'package:graduation_project1/common/app_style.dart';
import 'package:graduation_project1/common/reusable_text.dart';
import 'package:graduation_project1/constants/constants.dart';
import 'package:graduation_project1/controllers/controllers.auth/passwordController.dart';
import 'package:graduation_project1/controllers/controllers.auth/login_controller.dart';
import 'package:graduation_project1/controllers/controllers.auth/registration_controller.dart';

class PasswordTextfield extends StatelessWidget {
  const PasswordTextfield({
    super.key,
    this.controller,
    this.title,
    this.islogin = true,
  });

  final TextEditingController? controller;
  final String? title;
  final bool islogin;

  @override
  Widget build(BuildContext context) {
    final passwordController = Get.put(Passwordcontroller());
    final loginController = Get.find<LoginController>();
    final RegistrationController registrationController =
        Get.put(RegistrationController());

    return Obx(() {
      // ✅ Find a password-related error message
      String? errorMessage = islogin
          ? loginController.errors.firstWhereOrNull(
              (error) => error.toLowerCase().contains("password"),
            )
          : registrationController.fieldErrors["password"];

      return Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          ReusableText(
            text: title ?? 'Password',
            style: appStyle(14, kBlue, FontWeight.w400),
          ),
          SizedBox(height: 5.h),
          TextFormField(
            cursorColor: kDarkBlue,
            textInputAction: TextInputAction.next,
            keyboardType: TextInputType.visiblePassword,
            obscureText: passwordController.password,
            controller: controller,
            onChanged: (value) {
              // ✅ Corrected error removal
              if (islogin) {
                loginController.errors.removeWhere(
                    (error) => error.toLowerCase().contains("password"));
              } else {
                registrationController.fieldErrors
                    .remove("password"); // ✅ Fixed: Remove by key
                registrationController.fieldErrors
                    .refresh(); // ✅ Ensure UI updates
              }
            },
            validator: (value) {
              if (value == null || value.isEmpty) {
                return "Password is required";
              }
              return null;
            },
            style: appStyle(15, kDarkBlue, FontWeight.normal),
            decoration: InputDecoration(
              filled: true,
              fillColor: Kbackground,
              suffixIcon: GestureDetector(
                onTap: () {
                  passwordController.setPassword = !passwordController.password;
                },
                child: Icon(
                  passwordController.password
                      ? Icons.visibility_off
                      : Icons.visibility,
                  size: 20,
                  color: kBlue,
                ),
              ),
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
