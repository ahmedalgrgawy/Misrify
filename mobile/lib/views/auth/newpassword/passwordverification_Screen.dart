import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:flutter_vector_icons/flutter_vector_icons.dart';
import 'package:get/get.dart';
import 'package:graduation_project1/common/app_style.dart';
import 'package:graduation_project1/common/back_ground_container.dart';
import 'package:graduation_project1/common/custom_button.dart';
import 'package:graduation_project1/common/reusable_text.dart';
import 'package:graduation_project1/constants/constants.dart';
import 'package:flutter_otp_text_field/flutter_otp_text_field.dart';
import 'package:graduation_project1/controllers/controllers.auth/forgetpassword_controller.dart';
import 'package:graduation_project1/controllers/controllers.auth/verification_controller.dart';
import 'package:graduation_project1/models/forget_password_model.dart';

class PasswordverificationScreen extends StatelessWidget {
  const PasswordverificationScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final controller = Get.put(VerificationController());
    final mailController = Get.put(ForgetpasswordController());
    return Scaffold(
        backgroundColor: kLightWhite,
        body: Stack(
          children: [
            Padding(
              padding: EdgeInsets.symmetric(horizontal: 15.w, vertical: 60.h),
              child: Positioned(
                  top: 60.h,
                  child: GestureDetector(
                    onTap: () => Get.back(),
                    child: CircleAvatar(
                      radius: 20.r,
                      backgroundColor: Colors.white,
                      child: const Icon(
                        Icons.arrow_back,
                        color: kLightBlue,
                      ),
                    ),
                  )),
            ),
            Padding(
              padding: const EdgeInsets.only(top: 120.0),
              child: BackGroundContainer(
                  color: Colors.white,
                  child: ClipRRect(
                    borderRadius: BorderRadius.only(
                      topLeft: Radius.circular(40.r),
                      topRight: Radius.circular(40.r),
                    ),
                    child: ListView(
                      children: [
                        Padding(
                          padding: EdgeInsets.symmetric(horizontal: 30.w),
                          child: Column(
                            children: [
                              ReusableText(
                                text: 'Forget password',
                                style: appStyle(24, kBlue, FontWeight.w500),
                              ),
                              SizedBox(
                                height: 20.h,
                              ),
                              ReusableText(
                                text: 'Email Verification',
                                style: appStyle(16, kBlue, FontWeight.w400),
                              ),
                              SizedBox(
                                height: 25.h,
                              ),
                              ReusableText(
                                text: 'Get Your Code',
                                style: appStyle(14, kBlue, FontWeight.w400),
                              ),
                              SizedBox(
                                height: 25.h,
                              ),
                              ReusableText(
                                maxlines: 5,
                                align: TextAlign.center,
                                SoftWrap: true,
                                text:
                                    'Please Enter The 4 Digit Code Send To ${mailController.getSavedEmail()}  ',
                                style: appStyle(14, kBlue, FontWeight.w400),
                              ),
                              SizedBox(
                                height: 25.h,
                              ),
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
                                  mainAxisAlignment:
                                      MainAxisAlignment.spaceBetween,
                                  onCodeChanged: (String code) {
                                    if (code.isNotEmpty) {
                                      controller.setCode = code;
                                    }
                                  },
                                  onSubmit: (String verificationCode) {
                                    if (verificationCode.isNotEmpty) {
                                      controller.setCode = verificationCode;
                                    } else {
                                      Get.snackbar(
                                          'Error', 'Invalid OTP format',
                                          colorText: Colors.white,
                                          backgroundColor: Colors.red);
                                    }
                                  },
                                ),
                              ),
                              SizedBox(
                                height: 25.h,
                              ),
                              Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  ReusableText(
                                      text: 'You don’t Receive Code? ',
                                      style: appStyle(
                                          12, kDarkBlue, FontWeight.w400)),
                                  GestureDetector(
                                    onTap: () {
                                      Get.snackbar(
                                          'The code resent successfuly',
                                          'Please check your email',
                                          colorText: kLightWhite,
                                          backgroundColor: kLightBlue,
                                          icon: const Icon(Ionicons
                                              .checkmark_circle_outline));
                                      ForgetPasswordModel model =
                                          ForgetPasswordModel(
                                        email: mailController
                                            .getSavedEmail()
                                            .toString(),
                                      );

                                      String data =
                                          forgetPasswordModelToJson(model);
                                      mailController.ForgetpasswordFunction(
                                          data);
                                    },
                                    child: ReusableText(
                                        text: 'Resend',
                                        style: appStyle(
                                            12, kRed, FontWeight.w400)),
                                  )
                                ],
                              ),
                              SizedBox(
                                height: 25.h,
                              ),
                              CustomButton(
                                onTap: () {
                                  controller.ResetPasswordVerification();
                                },
                                text: 'Verify',
                                textcolor: Kbackground,
                                btnColor: kLightBlue,
                                btnHeight: 48.h,
                                btnWidth: width,
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  )),
            ),
          ],
        ));
  }
}
