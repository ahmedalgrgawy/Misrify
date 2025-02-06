import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:get/get.dart';
import 'package:graduation_project1/common/app_style.dart';
import 'package:graduation_project1/common/back_ground_container.dart';
import 'package:graduation_project1/common/custom_button.dart';
import 'package:graduation_project1/common/custom_text_container.dart';
import 'package:graduation_project1/common/reusable_text.dart';
import 'package:graduation_project1/constants/constants.dart';
import 'package:graduation_project1/constants/uidata.dart';
import 'package:graduation_project1/controllers/controllers.auth/registration_controller.dart';
import 'package:graduation_project1/models/registration_model.dart';
import 'package:graduation_project1/views/auth/login_Screen.dart';
import 'package:graduation_project1/views/auth/widgets/email_textfield.dart';
import 'package:graduation_project1/views/auth/widgets/iconbutton.dart';
import 'package:graduation_project1/views/auth/widgets/password_textfield.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  late final TextEditingController _emailController = TextEditingController();
  late final TextEditingController _passwordController =
      TextEditingController();
  late final TextEditingController _userController = TextEditingController();
  late final TextEditingController _phonenumberController =
      TextEditingController();
  late final TextEditingController _addressControler = TextEditingController();
  late final TextEditingController _genderController = TextEditingController();
  final FocusNode _passwordFocusNode = FocusNode();

  @override
  void dispose() {
    _passwordFocusNode.dispose();
    _passwordController.dispose();
    _emailController.dispose();
    _userController.dispose();
    _phonenumberController.dispose();
    _addressControler.dispose();
    _genderController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final controller = Get.put(RegistrationController());

    return Scaffold(
      backgroundColor: Kbackground,
      body: Padding(
        padding: const EdgeInsets.only(top: 150.0),
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
                  padding:
                      EdgeInsets.only(left: 30.w, right: 30.w, bottom: 20.h),
                  child: Column(
                    children: [
                      ReusableText(
                        text: 'Sign Up',
                        style: appStyle(32, kDarkest, FontWeight.w700),
                      ),
                      SizedBox(height: 30.h),
                      EmailTextfield(
                        title: 'Your Name',
                        controller: _userController,
                      ),
                      SizedBox(height: 10.h),
                      EmailTextfield(
                        title: 'Email Address',
                        controller: _emailController,
                      ),
                      SizedBox(height: 10.h),
                      PasswordTextfield(
                        controller: _passwordController,
                      ),
                      SizedBox(height: 10.h),
                      EmailTextfield(
                        title: 'Phone Number',
                        controller: _phonenumberController,
                      ),
                      EmailTextfield(
                        title: 'Address',
                        controller: _addressControler,
                      ),
                      SizedBox(height: 10.h),
                      CustomTextContainer(
                        title: 'Gender',
                        suffixIcon: DropdownButtonFormField<String>(
                          style: appStyle(15, kDarkBlue, FontWeight.normal),
                          decoration: InputDecoration(
                              filled: true,
                              fillColor: Kbackground,
                              hintText: "Select Gender",
                              hintStyle:
                                  appStyle(14, kLightGray, FontWeight.normal),
                              contentPadding: EdgeInsets.symmetric(
                                  vertical: 10.h, horizontal: 12.w),
                              errorBorder: OutlineInputBorder(
                                  borderSide:
                                      const BorderSide(color: kRed, width: .5),
                                  borderRadius:
                                      BorderRadius.all(Radius.circular(15.r))),
                              focusedBorder: OutlineInputBorder(
                                  borderSide: const BorderSide(
                                      color: kLightGray, width: .5),
                                  borderRadius:
                                      BorderRadius.all(Radius.circular(15.r))),
                              focusedErrorBorder: OutlineInputBorder(
                                  borderSide:
                                      const BorderSide(color: kRed, width: .5),
                                  borderRadius:
                                      BorderRadius.all(Radius.circular(15.r))),
                              disabledBorder: OutlineInputBorder(
                                  borderSide: const BorderSide(
                                      color: Kbackground, width: .5),
                                  borderRadius:
                                      BorderRadius.all(Radius.circular(15.r))),
                              enabledBorder: OutlineInputBorder(
                                  borderSide: const BorderSide(
                                      color: Kbackground, width: .5),
                                  borderRadius:
                                      BorderRadius.all(Radius.circular(15.r))),
                              border: OutlineInputBorder(borderSide: const BorderSide(color: Kbackground, width: .5), borderRadius: BorderRadius.all(Radius.circular(15.r)))),
                          icon: const Icon(
                            CupertinoIcons.chevron_down,
                            size: 16,
                            color: kBlue,
                          ),
                          items: const [
                            DropdownMenuItem(
                              value: 'male',
                              child: Text('male'),
                            ),
                            DropdownMenuItem(
                              value: 'female',
                              child: Text('female'),
                            ),
                          ],
                          onChanged: (String? value) {
                            if (value != null) {
                              setState(() {
                                _genderController.text = value;
                              });
                            }
                          },
                        ),
                        controller: _genderController,
                      ),
                      SizedBox(height: 120.h),
                      Row(
                        crossAxisAlignment: CrossAxisAlignment
                            .start, // Aligns checkbox and text at the top
                        children: [
                          Obx(
                            () => Checkbox(
                              side:
                                  const BorderSide(color: kDarkBlue, width: 2),
                              value: controller.agreement.value,
                              onChanged: (value) => controller.agreement.value =
                                  !controller.agreement.value,
                              checkColor: kDarkBlue,
                              activeColor: Kbackground,
                            ),
                          ),
                          Expanded(
                            child: ReusableText(
                              text:
                                  'I agree to the terms and conditions and Privacy Policy.',
                              SoftWrap: true,
                              align: TextAlign.start,
                              maxlines: 4,
                              style: appStyle(14, kBlue, FontWeight.w400),
                            ),
                          ),
                        ],
                      ),
                      SizedBox(height: 16.h),
                      CustomButton(
                        onTap: () {
                          if (_emailController.text.isNotEmpty &&
                              _userController.text.isNotEmpty &&
                              _addressControler.text.isNotEmpty &&
                              _phonenumberController.text.isNotEmpty &&
                              _genderController.text.isNotEmpty &&
                              _passwordController.text.length >= 8) {
                            RegistrationModel model = RegistrationModel(
                              name: _userController.text,
                              email: _emailController.text,
                              password: _passwordController.text,
                              address: _addressControler.text,
                              phoneNumber: _phonenumberController.text,
                              gender: _genderController.text,
                            );

                            String data = registrationModelToJson(model);
                            controller.registerationFunction(data);
                          } else {
                            Get.snackbar('Error', 'All fields are required',
                                colorText: Colors.white,
                                backgroundColor: Colors.red);
                          }
                        },
                        text: 'Sign Up',
                        btnColor: kLightBlue,
                        btnHeight: 48.h,
                        textcolor: Kbackground,
                        btnWidth: width,
                      ),
                      SizedBox(height: 30.h),
                      ReusableText(
                          text: 'Or',
                          style: appStyle(12, kBlue, FontWeight.w700)),
                      SizedBox(height: 30.h),
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 40.0),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            LoginIconbutton(image: LogoImages.google),
                            LoginIconbutton(image: LogoImages.ios),
                            LoginIconbutton(image: LogoImages.facebook),
                          ],
                        ),
                      ),
                      SizedBox(height: 30.h),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          ReusableText(
                              text: 'Already have an account?',
                              style: appStyle(12, kDarkBlue, FontWeight.w500)),
                          GestureDetector(
                            onTap: () {
                              Get.to(() => const LoginScreen(),
                                  transition: Transition.fadeIn,
                                  duration: const Duration(milliseconds: 1200));
                            },
                            child: ReusableText(
                                text: ' Login',
                                style:
                                    appStyle(12, kDarkBlue, FontWeight.w800)),
                          ),
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
    );
  }
}
