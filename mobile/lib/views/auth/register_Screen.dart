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
  final RegistrationController controller = Get.put(RegistrationController());

  late final TextEditingController _emailController = TextEditingController();
  late final TextEditingController _passwordController =
      TextEditingController();
  late final TextEditingController _userController = TextEditingController();
  late final TextEditingController _phonenumberController =
      TextEditingController();
  late final TextEditingController _addressController = TextEditingController();
  late final TextEditingController _genderController = TextEditingController();

  final FocusNode _passwordFocusNode = FocusNode();

  @override
  void dispose() {
    _passwordFocusNode.dispose();
    _passwordController.dispose();
    _emailController.dispose();
    _userController.dispose();
    _phonenumberController.dispose();
    _addressController.dispose();
    _genderController.dispose();
    super.dispose();
  }

  void _registerUser() {
    if (_userController.text.isEmpty) {
      controller.fieldErrors["name"] = "Name is required";
    }
    if (_emailController.text.isEmpty) {
      controller.fieldErrors["email"] = "Email is required";
    }
    if (_passwordController.text.isEmpty) {
      controller.fieldErrors["password"] = "Password is required";
    }

    if (_phonenumberController.text.isEmpty) {
      controller.fieldErrors["phoneNumber"] = "Phone number is required";
    }
    if (_addressController.text.isEmpty) {
      controller.fieldErrors["address"] = "Address is required";
    }
    if (_genderController.text.isEmpty) {
      controller.fieldErrors["gender"] = "Gender is required";
    }

    if (controller.fieldErrors.isNotEmpty) return;
    RegistrationModel model = RegistrationModel(
      name: _userController.text.trim(),
      email: _emailController.text.trim(),
      password: _passwordController.text.trim(),
      phoneNumber: _phonenumberController.text.trim(),
      address: _addressController.text.trim(),
      gender: _genderController.text.trim(),
    );

    // ✅ Convert model to JSON and send to API
    String data = registrationModelToJson(model);
    controller.registerUser(data);
  }

  @override
  Widget build(BuildContext context) {
    final RegistrationController registrationController =
        Get.find<RegistrationController>();
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
                      CustomTextContainer(
                        title: 'Your Name',
                        controller: _userController,
                        fieldName: 'name',
                      ),
                      SizedBox(height: 10.h),

                      EmailTextfield(
                        islogin: false,
                        title: 'Email Address',
                        controller: _emailController,
                      ),
                      SizedBox(height: 10.h),

                      PasswordTextfield(
                        islogin: false,
                        controller: _passwordController,
                      ),
                      SizedBox(height: 10.h),

                      CustomTextContainer(
                        title: 'Phone Number',
                        controller: _phonenumberController,
                        fieldName: 'phoneNumber',
                        keyboardType: TextInputType.phone,
                      ),

                      CustomTextContainer(
                        title: 'Address',
                        controller: _addressController,
                        fieldName: 'address',
                      ),
                      SizedBox(height: 10.h),

                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          ReusableText(
                              text: "Gender",
                              style: appStyle(14, kBlue, FontWeight.w400)),
                          SizedBox(height: 5.h),
                          Obx(() {
                            String? errorMessage =
                                registrationController.fieldErrors['gender'];

                            return DropdownButtonFormField<String>(
                              style: appStyle(15, kDarkBlue, FontWeight.normal),
                              decoration: InputDecoration(
                                filled: true,
                                fillColor: Kbackground,
                                hintText: "Select Gender",
                                isDense: true,
                                hintStyle:
                                    appStyle(14, kLightGray, FontWeight.normal),
                                contentPadding: EdgeInsets.symmetric(
                                    vertical: 10.h, horizontal: 12.w),
                                errorText: errorMessage,
                                border: OutlineInputBorder(
                                  borderSide: BorderSide(
                                      color: errorMessage != null
                                          ? kRed
                                          : Kbackground,
                                      width: 1.0),
                                  borderRadius:
                                      BorderRadius.all(Radius.circular(15.r)),
                                ),
                                enabledBorder: OutlineInputBorder(
                                  borderSide: BorderSide(
                                      color: errorMessage != null
                                          ? kRed
                                          : Kbackground,
                                      width: 1.0),
                                  borderRadius:
                                      BorderRadius.all(Radius.circular(15.r)),
                                ),
                                focusedBorder: OutlineInputBorder(
                                  borderSide: BorderSide(
                                      color: errorMessage != null
                                          ? kRed
                                          : kLightGray,
                                      width: 1.0),
                                  borderRadius:
                                      BorderRadius.all(Radius.circular(15.r)),
                                ),
                                errorBorder: OutlineInputBorder(
                                  borderSide:
                                      const BorderSide(color: kRed, width: 1.0),
                                  borderRadius:
                                      BorderRadius.all(Radius.circular(15.r)),
                                ),
                                focusedErrorBorder: OutlineInputBorder(
                                  borderSide:
                                      const BorderSide(color: kRed, width: 1.0),
                                  borderRadius:
                                      BorderRadius.all(Radius.circular(15.r)),
                                ),
                              ),
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
                                registrationController.fieldErrors
                                    .remove('gender');
                                if (value != null) {
                                  setState(() {
                                    _genderController.text = value;
                                  });
                                }
                              },
                            );
                          }),
                        ],
                      ),
                      SizedBox(height: 120.h),

                      /// ✅ Checkbox for Agreement
                      Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
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

                      /// ✅ Sign Up Button
                      CustomButton(
                        onTap: _registerUser,
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
                          SizedBox(width: 5.w),
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
