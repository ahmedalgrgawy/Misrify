import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:get/get.dart';
import 'package:graduation_project1/common/app_style.dart';
import 'package:graduation_project1/common/back_ground_container.dart';
import 'package:graduation_project1/common/custom_button.dart';
import 'package:graduation_project1/common/reusable_text.dart';
import 'package:graduation_project1/constants/constants.dart';
import 'package:graduation_project1/controllers/controllers.auth/forgetpassword_controller.dart';
import 'package:graduation_project1/models/forget_password_model.dart';
import 'package:graduation_project1/views/auth/widgets/email_textfield.dart';

class ForgetpasswordScreen extends StatefulWidget {
  const ForgetpasswordScreen({super.key});

  @override
  State<ForgetpasswordScreen> createState() => _ForgetpasswordScreenState();
}

class _ForgetpasswordScreenState extends State<ForgetpasswordScreen> {
  late final TextEditingController _emailController = TextEditingController();
  @override
  void dispose() {
    _emailController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final controller = Get.put(ForgetpasswordController());

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
                                maxlines: 5,
                                align: TextAlign.center,
                                SoftWrap: true,
                                text:
                                    'Please Enter Your Email Address To Recieve a Verification Code',
                                style: appStyle(13, kBlue, FontWeight.w400),
                              ),
                              SizedBox(
                                height: 25.h,
                              ),
                              EmailTextfield(
                                title: 'Email Address',
                                controller: _emailController,
                              ),
                              SizedBox(
                                height: 25.h,
                              ),
                              SizedBox(
                                height: 14.h,
                              ),
                              GestureDetector(
                                onTap: () {
                                  if (_emailController.text.isNotEmpty) {
                                    ForgetPasswordModel model =
                                        ForgetPasswordModel(
                                      email: _emailController.text,
                                    );

                                    String data =
                                        forgetPasswordModelToJson(model);
                                    controller.ForgetpasswordFunction(data);
                                  }
                                },
                                child: Center(
                                  child: ReusableText(
                                      text: 'Try with Phone Number',
                                      style: appStyle(
                                          14, kDarkBlue, FontWeight.w400)),
                                ),
                              ),
                              SizedBox(
                                height: 30.h,
                              ),
                              CustomButton(
                                onTap: () {
                                  if (_emailController.text.isNotEmpty) {
                                    ForgetPasswordModel model =
                                        ForgetPasswordModel(
                                      email: _emailController.text,
                                    );

                                    String data =
                                        forgetPasswordModelToJson(model);
                                    controller.ForgetpasswordFunction(data);
                                  }
                                },
                                text: 'Send',
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
