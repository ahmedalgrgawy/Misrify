import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:get/get.dart';
import 'package:graduation_project1/common/app_style.dart';
import 'package:graduation_project1/common/back_ground_container.dart';
import 'package:graduation_project1/common/custom_button.dart';
import 'package:graduation_project1/common/reusable_text.dart';
import 'package:graduation_project1/constants/constants.dart';
import 'package:graduation_project1/controllers/controllers.auth/resetpassword_controller.dart';
import 'package:graduation_project1/views/auth/widgets/password_textfield.dart';

class NewpasswordScreen extends StatefulWidget {
  const NewpasswordScreen({super.key});

  @override
  State<NewpasswordScreen> createState() => _NewpasswordScreenState();
}

class _NewpasswordScreenState extends State<NewpasswordScreen> {
  late final TextEditingController _passwordController =
      TextEditingController();
  late final TextEditingController _confirmpasswordController =
      TextEditingController();
  final FocusNode _passwordFocusNode = FocusNode();

  final ResetpasswordController controller = Get.put(ResetpasswordController());

  @override
  void dispose() {
    _passwordFocusNode.dispose();
    _passwordController.dispose();
    _confirmpasswordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
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
                                  text: 'Reset Password',
                                  style: appStyle(24, kBlue, FontWeight.w500),
                                ),
                                SizedBox(height: 20.h),
                                ReusableText(
                                  text: 'Enter New Password',
                                  style: appStyle(16, kBlue, FontWeight.w400),
                                ),
                                SizedBox(height: 25.h),
                                ReusableText(
                                  maxlines: 5,
                                  align: TextAlign.center,
                                  SoftWrap: true,
                                  text:
                                      'Your new password must be different from your previously used password.',
                                  style: appStyle(14, kBlue, FontWeight.w400),
                                ),
                                SizedBox(height: 25.h),
                                PasswordTextfield(
                                  title: 'New Password',
                                  controller: _passwordController,
                                ),
                                SizedBox(height: 20.h),
                                PasswordTextfield(
                                  title: 'Confirm Password',
                                  controller: _confirmpasswordController,
                                ),
                                SizedBox(height: 25.h),
                                Padding(
                                  padding: const EdgeInsets.symmetric(
                                      horizontal: 12.0),
                                  child: Obx(() => CustomButton(
                                        onTap: () {
                                          if (_passwordController
                                                  .text.isEmpty ||
                                              _confirmpasswordController
                                                  .text.isEmpty) {
                                            Get.snackbar('Error',
                                                'Please enter both password fields',
                                                colorText: Colors.white,
                                                backgroundColor: Colors.red);
                                            return;
                                          }

                                          if (_passwordController.text !=
                                              _confirmpasswordController.text) {
                                            Get.snackbar('Error',
                                                'Passwords do not match',
                                                colorText: Colors.white,
                                                backgroundColor: Colors.red);
                                            return;
                                          }

                                          controller.setPassword =
                                              _passwordController.text;
                                          controller.ResetFunction();
                                        },
                                        text: controller.isLoading
                                            ? 'Loading...'
                                            : 'Confirm',
                                        textcolor: Kbackground,
                                        btnColor: kLightBlue,
                                        btnHeight: 48.h,
                                        btnWidth: width,
                                      )),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ))),
          ],
        ));
  }
}
