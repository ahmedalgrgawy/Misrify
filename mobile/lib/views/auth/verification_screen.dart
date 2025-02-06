import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:graduation_project1/common/app_style.dart';
import 'package:graduation_project1/common/back_ground_container.dart';
import 'package:graduation_project1/common/custom_button.dart';
import 'package:graduation_project1/common/reusable_text.dart';
import 'package:graduation_project1/controllers/controllers.auth/registration_controller.dart';
import 'package:graduation_project1/controllers/controllers.auth/verification_controller.dart';
import 'package:flutter_otp_text_field/flutter_otp_text_field.dart';
import 'package:graduation_project1/constants/constants.dart';

class VerificationScreen extends StatelessWidget {
  const VerificationScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final controller = Get.put(VerificationController());
    final mailController = Get.put(RegistrationController());
    return Scaffold(
        backgroundColor: Kbackground,
        body: Padding(
            padding: const EdgeInsets.only(top: 120.0),
            child: BackGroundContainer(
              color: Colors.white,
              child: ClipRRect(
                borderRadius: BorderRadius.only(
                  topLeft: Radius.circular(40.r),
                  topRight: Radius.circular(40.r),
                ),
                child: ListView(children: [
                  Padding(
                    padding: EdgeInsets.symmetric(horizontal: 30.w),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                      children: [
                        ReusableText(
                          text: 'Verify Your Account',
                          style: appStyle(24, kBlue, FontWeight.w600),
                        ),
                        SizedBox(height: 40.h),
                        ReusableText(
                          text:
                              "Please Enter The 4 Digit Code Send To ${mailController.getSavedEmail()}.",
                          style: appStyle(14, kBlue, FontWeight.w400),
                          maxlines: 5,
                          align: TextAlign.center,
                          SoftWrap: true,
                        ),
                        SizedBox(height: 40.h),
                        Padding(
                          padding: EdgeInsets.symmetric(horizontal: 40.w),
                          child: OtpTextField(
                            borderRadius: BorderRadius.circular(40),
                            showCursor: false,
                            focusedBorderColor: kLightGray,
                            alignment: Alignment.center,
                            numberOfFields: 4,
                            filled: true,
                            fillColor: kLightWhite,
                            borderColor: kBlue,
                            borderWidth: 2.0,
                            textStyle:
                                appStyle(17, kLightBlue, FontWeight.w500),
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            onCodeChanged: (String code) {
                              if (code.isNotEmpty) {
                                controller.setCode = code;
                              }
                            },
                            onSubmit: (String verificationCode) {
                              if (verificationCode.isNotEmpty) {
                                controller.setCode =
                                    verificationCode; // Store dynamically
                              } else {
                                Get.snackbar('Error', 'Invalid OTP format',
                                    colorText: Colors.white,
                                    backgroundColor: Colors.red);
                              }
                            },
                          ),
                        ),
                        SizedBox(height: 80.h),
                        CustomButton(
                          onTap: () {
                            controller.VerificationFunction();
                          },
                          text: 'Verify',
                          textcolor: Kbackground,
                          btnColor: kLightBlue,
                          btnHeight: 48.h,
                          btnWidth: width,
                        ),
                        const SizedBox(height: 10),
                      ],
                    ),
                  ),
                ]),
              ),
            )));
  }
}
