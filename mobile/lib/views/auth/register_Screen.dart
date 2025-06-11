import 'package:flutter/cupertino.dart';
import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:get/get.dart';
import 'package:graduation_project1/common/app_style.dart';
import 'package:graduation_project1/common/back_ground_container.dart';
import 'package:graduation_project1/common/custom_button.dart';
import 'package:graduation_project1/common/custom_text_container.dart';
import 'package:graduation_project1/common/policy_sheet.dart';
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

  /// ✅ Function to handle registration with proper validation
  void _registerUser() {
    controller.fieldErrors.clear();
    controller.generalError.value = "";

    RegistrationModel model = RegistrationModel(
      name: _userController.text.trim(),
      email: _emailController.text.trim(),
      password: _passwordController.text.trim(),
      phoneNumber: _phonenumberController.text.trim(),
      address: _addressController.text.trim(),
      gender: _genderController.text.trim(),
    );

    if (model.name.isEmpty) controller.fieldErrors["name"] = "Name is required";
    if (model.email.isEmpty) {
      controller.fieldErrors["email"] = "Email is required";
    }
    if (model.password.isEmpty || model.password.length < 6) {
      controller.fieldErrors["password"] =
          "Password must be at least 6 characters";
    }
    if (model.phoneNumber.isEmpty) {
      controller.fieldErrors["phoneNumber"] = "Phone number is required";
    }
    if (model.address.isEmpty) {
      controller.fieldErrors["address"] = "Address is required";
    }
    if (model.gender.isEmpty) {
      controller.fieldErrors["gender"] = "Gender is required";
    }

    if (controller.fieldErrors.isNotEmpty) return;

    String data = registrationModelToJson(model);
    controller.registerUser(data);
  }

  @override
  Widget build(BuildContext context) {
    final RegistrationController registrationController =
        Get.find<RegistrationController>();
    return Scaffold(
      backgroundColor: Kbackground,
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            backgroundColor: Kbackground,
            expandedHeight: 150.h,
            floating: false,
            pinned: false,
            snap: false,
            automaticallyImplyLeading: false,
            flexibleSpace: FlexibleSpaceBar(
              centerTitle: true,
              background: Padding(
                padding: EdgeInsets.only(top: 40.h),
                child: Image.asset('assets/icons/MISRIFY.png'),
              ),
            ),
          ),
          SliverFillRemaining(
            hasScrollBody: true,
            child: BackGroundContainer(
              color: Colors.white,
              child: ClipRRect(
                borderRadius: BorderRadius.only(
                  topLeft: Radius.circular(40.r),
                  topRight: Radius.circular(40.r),
                ),
                child: Padding(
                  padding: EdgeInsets.only(
                      left: 30.w, right: 30.w, bottom: 40.h, top: 30.h),
                  child: SingleChildScrollView(
                    physics: const BouncingScrollPhysics(),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
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
                          title: 'Email Address',
                          suffixIcon: const Icon(
                            CupertinoIcons.check_mark_circled_solid,
                            size: 20,
                            color: kBlue,
                          ),
                          controller: _emailController,
                          islogin: false,
                        ),
                        SizedBox(height: 10.h),
                        PasswordTextfield(
                          controller: _passwordController,
                          islogin: false,
                        ),
                        SizedBox(height: 10.h),
                        CustomTextContainer(
                          title: 'Phone Number',
                          controller: _phonenumberController,
                          fieldName: 'phoneNumber',
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
                              text: 'Gender',
                              style: appStyle(14, kBlue, FontWeight.w400),
                            ),
                            SizedBox(height: 5.h),
                            Obx(() {
                              String? errorMessage =
                                  controller.fieldErrors['gender'];
                              return DropdownButtonFormField(
                                style:
                                    appStyle(15, kDarkBlue, FontWeight.normal),
                                hint: ReusableText(
                                    text: "Select Gender",
                                    style: appStyle(
                                        14, kLightGray, FontWeight.normal)),
                                items: const [
                                  DropdownMenuItem(
                                      value: 'male', child: Text('Male')),
                                  DropdownMenuItem(
                                      value: 'female', child: Text('Female')),
                                ],
                                onChanged: (String? value) {
                                  if (value != null) {
                                    _genderController.text = value;
                                    controller.fieldErrors.remove("gender");
                                    controller.fieldErrors.refresh();
                                  }
                                },
                                decoration: InputDecoration(
                                  filled: true,
                                  fillColor: Kbackground,
                                  isDense: true,
                                  contentPadding: EdgeInsets.symmetric(
                                      vertical: 10.h, horizontal: 12.w),
                                  errorText: errorMessage,
                                  border: OutlineInputBorder(
                                    borderSide: BorderSide(
                                        color: errorMessage != null
                                            ? kRed
                                            : Kbackground,
                                        width: .5),
                                    borderRadius:
                                        BorderRadius.all(Radius.circular(15.r)),
                                  ),
                                  enabledBorder: OutlineInputBorder(
                                    borderSide: BorderSide(
                                        color: errorMessage != null
                                            ? kRed
                                            : Kbackground,
                                        width: .5),
                                    borderRadius:
                                        BorderRadius.all(Radius.circular(15.r)),
                                  ),
                                  focusedBorder: OutlineInputBorder(
                                    borderSide: BorderSide(
                                        color: errorMessage != null
                                            ? kRed
                                            : kLightGray,
                                        width: .5),
                                    borderRadius:
                                        BorderRadius.all(Radius.circular(15.r)),
                                  ),
                                  errorBorder: OutlineInputBorder(
                                    borderSide:
                                        BorderSide(color: kRed, width: .5),
                                    borderRadius:
                                        BorderRadius.all(Radius.circular(15.r)),
                                  ),
                                  focusedErrorBorder: OutlineInputBorder(
                                    borderSide:
                                        BorderSide(color: kRed, width: .5),
                                    borderRadius:
                                        BorderRadius.all(Radius.circular(15.r)),
                                  ),
                                ),
                              );
                            }),
                          ],
                        ),
                        SizedBox(height: 30.h),
                        Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Obx(() => Checkbox(
                                  side: const BorderSide(
                                      color: kDarkBlue, width: 2),
                                  value: controller.agreement.value,
                                  onChanged: (value) => controller.agreement
                                      .value = !controller.agreement.value,
                                  checkColor: kDarkBlue,
                                  activeColor: Kbackground,
                                )),
                            Expanded(
                              child: RichText(
                                textAlign: TextAlign.left,
                                text: TextSpan(
                                  style: appStyle(12, kGray, FontWeight.w400),
                                  children: [
                                    const TextSpan(text: 'You agree to our '),
                                    TextSpan(
                                      text: 'Terms of service ',
                                      style: const TextStyle(
                                        color: KTextColor,
                                        decoration: TextDecoration.underline,
                                      ),
                                      recognizer: TapGestureRecognizer()
                                        ..onTap = () {
                                          showPolicySheet(context,
                                              'Terms of Service', termsText);
                                        },
                                    ),
                                    const TextSpan(text: 'or '),
                                    TextSpan(
                                      text: 'Privacy Policy',
                                      style: const TextStyle(
                                        color: KTextColor,
                                        decoration: TextDecoration.underline,
                                      ),
                                      recognizer: TapGestureRecognizer()
                                        ..onTap = () {
                                          showPolicySheet(context,
                                              'Privacy Policy', privacyText);
                                        },
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          ],
                        ),
                        SizedBox(height: 20.h),
                        CustomButton(
                          onTap: _registerUser,
                          text: 'Sign Up',
                          btnColor: kLightBlue,
                          btnHeight: 48.h,
                          textcolor: Kbackground,
                          btnWidth: double.infinity,
                        ),
                        SizedBox(height: 30.h),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            ReusableText(
                                text: 'Already have an account?',
                                style:
                                    appStyle(12, kDarkBlue, FontWeight.w500)),
                            GestureDetector(
                              onTap: () {
                                Get.to(() => const LoginScreen(),
                                    transition: Transition.fadeIn,
                                    duration:
                                        const Duration(milliseconds: 1200));
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
                  ),
                ),
              ),
            ),
          )
        ],
      ),
    );
  }
}
