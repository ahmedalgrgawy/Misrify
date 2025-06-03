import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:get/get.dart';
import 'package:graduation_project1/common/app_style.dart';
import 'package:graduation_project1/common/back_ground_container.dart';
import 'package:graduation_project1/common/custom_button.dart';
import 'package:graduation_project1/common/reusable_text.dart';
import 'package:graduation_project1/constants/constants.dart';
import 'package:graduation_project1/constants/uidata.dart';
import 'package:graduation_project1/controllers/controllers.auth/login_controller.dart';
import 'package:graduation_project1/models/login_model.dart';
import 'package:graduation_project1/views/auth/newpassword/forgetpassword_Screen.dart';
import 'package:graduation_project1/views/auth/register_Screen.dart';
import 'package:graduation_project1/views/auth/widgets/email_textfield.dart';
import 'package:graduation_project1/views/auth/widgets/iconbutton.dart';
import 'package:graduation_project1/views/auth/widgets/password_textfield.dart';
import 'package:graduation_project1/views/entrypoint.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  late final TextEditingController _emailController = TextEditingController();
  late final TextEditingController _passwordController =
      TextEditingController();
  final FocusNode _passwordFocusNode = FocusNode();

  @override
  void dispose() {
    _passwordFocusNode.dispose();
    _passwordController.dispose();
    _emailController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final controller = Get.put(LoginController());

    return Scaffold(
      backgroundColor: Kbackground,
      body: Column(
        children: [
          SizedBox(height: 80.h), // Add top spacing if needed
          Image.asset(
            'assets/icons/MISRIFY.png',
          ),
          Expanded(
            child: Padding(
              padding: const EdgeInsets.only(top: 40.0),
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
                        padding: EdgeInsets.only(
                            left: 30.w, right: 30.w, bottom: 20.h),
                        child: Column(
                          children: [
                            ReusableText(
                              text: 'Sign In',
                              style: appStyle(32, kDarkest, FontWeight.w700),
                            ),
                            SizedBox(height: 30.h),
                            EmailTextfield(
                              title: 'Email Address',
                              suffixIcon: const Icon(
                                CupertinoIcons.check_mark_circled_solid,
                                size: 20,
                                color: kBlue,
                              ),
                              controller: _emailController,
                            ),
                            SizedBox(height: 25.h),
                            PasswordTextfield(controller: _passwordController),
                            Padding(
                              padding: const EdgeInsets.only(top: 8.0),
                              child: Row(
                                mainAxisAlignment: MainAxisAlignment.end,
                                children: [
                                  GestureDetector(
                                    onTap: () {
                                      Get.to(() => const ForgetpasswordScreen(),
                                          transition: Transition.fadeIn,
                                          duration: const Duration(
                                              milliseconds: 1200));
                                    },
                                    child: ReusableText(
                                        text: 'Forget password?',
                                        style: appStyle(
                                            12, kDarkBlue, FontWeight.w500)),
                                  )
                                ],
                              ),
                            ),
                            SizedBox(height: 30.h),
                            CustomButton(
                              onTap: () {
                                if (_emailController.text.isEmpty) {
                                  controller.errors.add("Email is required");
                                  return;
                                }

                                if (_passwordController.text.isEmpty) {
                                  controller.errors.add("Password is required");
                                  return;
                                }

                                LoginModel model = LoginModel(
                                  email: _emailController.text,
                                  password: _passwordController.text,
                                );

                                String data = loginModelToJson(model);
                                controller.loginFunction(data);
                              },
                              text: 'Sign In',
                              btnColor: kLightBlue,
                              btnHeight: 48.h,
                              textcolor: Kbackground,
                              btnWidth: width,
                            ),
                            SizedBox(height: 20.h),
                            CustomButton(
                              onTap: () {
                                Get.to(() => MainScreen(),
                                    transition: Transition.fade,
                                    duration:
                                        const Duration(milliseconds: 900));
                              },
                              text: 'Guest Login',
                              btnColor: Colors.white,
                              btnHeight: 48.h,
                              btnWidth: width,
                            ),
                            SizedBox(height: 30.h),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                ReusableText(
                                    text: 'Don\'t have an account?',
                                    style: appStyle(
                                        12, kDarkBlue, FontWeight.w500)),
                                GestureDetector(
                                  onTap: () {
                                    Get.to(() => const RegisterScreen(),
                                        transition: Transition.fadeIn,
                                        duration:
                                            const Duration(milliseconds: 1200));
                                  },
                                  child: ReusableText(
                                      text: 'Sign Up',
                                      style: appStyle(
                                          12, kDarkBlue, FontWeight.w800)),
                                )
                              ],
                            ),
                          ],
                        ),
                      )
                    ],
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
