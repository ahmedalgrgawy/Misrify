import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:get/get.dart';
import 'package:graduation_project1/common/app_style.dart';
import 'package:graduation_project1/common/reusable_text.dart';
import 'package:graduation_project1/constants/constants.dart';
import 'package:graduation_project1/controllers/controllers.auth/passwordController.dart';

class PasswordTextfield extends StatelessWidget {
  const PasswordTextfield({
    super.key,
    this.controller,
    this.title,
  });

  final TextEditingController? controller;
  final String? title;

  @override
  Widget build(BuildContext context) {
    final passwordController = Get.put(Passwordcontroller());
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        ReusableText(
            text: title ?? 'Password',
            style: appStyle(14, kBlue, FontWeight.w400)),
        SizedBox(
          height: 5.h,
        ),
        Obx(
          () => TextFormField(
            cursorColor: kDarkBlue,
            textInputAction: TextInputAction.next,
            keyboardType: TextInputType.visiblePassword,
            obscureText: passwordController.password,
            controller: controller,
            validator: (value) {
              if (value!.isEmpty) {
                return "Please enter valid password";
              } else {
                return null;
              }
            },
            style: appStyle(15, kDarkBlue, FontWeight.normal),
            decoration: InputDecoration(
                filled: true,
                fillColor: Kbackground,
                suffixIcon: GestureDetector(
                  onTap: () {
                    passwordController.setPassword =
                        !passwordController.password;
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
        )
      ],
    );
  }
}
