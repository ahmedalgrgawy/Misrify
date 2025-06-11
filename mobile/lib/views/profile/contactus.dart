import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:get/get.dart';
import 'package:graduation_project1/common/app_style.dart';
import 'package:graduation_project1/common/custom_button.dart';
import 'package:graduation_project1/common/policy_sheet.dart';
import 'package:graduation_project1/common/reusable_text.dart';
import 'package:graduation_project1/constants/constants.dart';
import 'package:graduation_project1/constants/uidata.dart';
import 'package:graduation_project1/controllers/contactus_controller.dart';
import 'package:graduation_project1/models/contactus_model.dart';

import 'package:graduation_project1/views/profile/widgets/contact%20us/contact_info_card.dart';
import 'package:graduation_project1/views/profile/widgets/contact%20us/contactus_footer.dart';
import 'package:graduation_project1/views/profile/widgets/contact%20us/contactus_header.dart';
import 'package:graduation_project1/views/profile/widgets/contact%20us/contantus_text_container.dart';
import 'package:graduation_project1/views/profile/widgets/contact%20us/support_section.dart';

class ContactUsScreen extends StatefulWidget {
  const ContactUsScreen({super.key});

  @override
  State<ContactUsScreen> createState() => _ContactUsScreenState();
}

class _ContactUsScreenState extends State<ContactUsScreen> {
  final ContactusController controller = Get.put(ContactusController());

  late final TextEditingController _firstNameController =
      TextEditingController();
  late final TextEditingController _lastNameController =
      TextEditingController();
  late final TextEditingController _emailController = TextEditingController();
  late final TextEditingController _phoneController = TextEditingController();
  late final TextEditingController _messageController = TextEditingController();

  @override
  void dispose() {
    _firstNameController.dispose();
    _lastNameController.dispose();
    _emailController.dispose();
    _phoneController.dispose();
    _messageController.dispose();

    super.dispose();
  }

  void _contactus() {
    controller.fieldErrors.clear();
    controller.generalError.value = "";

    ContactUsModel model = ContactUsModel(
      firstName: _firstNameController.text.trim(),
      lastName: _lastNameController.text.trim(),
      email: _emailController.text.trim(),
      phone: _phoneController.text.trim(),
      message: _messageController.text.trim(),
    );

    if (model.firstName.isEmpty) {
      controller.fieldErrors["firstName"] = "FirstName is required";
    }

    if (model.email.isEmpty) {
      controller.fieldErrors["email"] = "Email is required";
    }

    if (model.phone.isEmpty) {
      controller.fieldErrors["phone"] = "Phone number is required";
    }
    if (model.lastName.isEmpty) {
      controller.fieldErrors["lastName"] = "LastName is required";
    }
    if (model.message.isEmpty) {
      controller.fieldErrors["message"] = "please,Enter your message";
    }
    if (model.message.length < 10) {
      controller.fieldErrors["message"] =
          "length must be at least 10 characters long";
    }

    if (controller.fieldErrors.isNotEmpty) return;

    String data = contactUsModelToJson(model);
    controller.sendmessage(data);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        children: [
          Container(
            height: MediaQuery.of(context).padding.top,
            color: kDarkBlue,
          ),
          Expanded(
            child: SingleChildScrollView(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Header
                  const ContactUsHeader(),

                  // Contact Form Card
                  Padding(
                    padding: const EdgeInsets.all(16),
                    child: Card(
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                      elevation: 4,
                      child: Padding(
                        padding: const EdgeInsets.all(16),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            ReusableText(
                                text: 'Get In Touch',
                                style:
                                    appStyle(26, kDarkBlue, FontWeight.bold)),
                            const SizedBox(height: 4),

                            ReusableText(
                              text: 'You can reach us anytime you want',
                              style: appStyle(12, kGray, FontWeight.w400),
                            ),
                            const SizedBox(height: 16),
                            // Name Fields
                            Row(
                              children: [
                                Expanded(
                                    child: ContantusTextContainer(
                                  title: 'First Name',
                                  controller: _firstNameController,
                                  fieldName: 'firstName',
                                )),
                                const SizedBox(width: 8),
                                Expanded(
                                  child: ContantusTextContainer(
                                      title: 'Last Name',
                                      controller: _lastNameController,
                                      fieldName: 'lastName'),
                                ),
                              ],
                            ),
                            const SizedBox(height: 12),
                            // Email Field
                            ContantusTextContainer(
                              title: 'Your E-mail',
                              fieldName: 'email',
                              controller: _emailController,
                              prefixIcon: const Icon(
                                Icons.email_outlined,
                                color: kGray,
                                size: 20,
                              ),
                            ),
                            const SizedBox(height: 12),
                            // Phone Field
                            ContantusTextContainer(
                                title: 'Phone',
                                fieldName: 'phone',
                                controller: _phoneController,
                                prefixIcon: const Icon(
                                  Icons.phone_android,
                                  color: kGray,
                                  size: 20,
                                )),

                            const SizedBox(height: 12),
                            // Message Field
                            ContantusTextContainer(
                              title: 'Your Message',
                              fieldName: 'message',
                              controller: _messageController,
                              hinttext: 'Type...',
                              maxliens: 5,
                            ),

                            const SizedBox(height: 16),
                            // Submit Button
                            CustomButton(
                              text: 'Submit',
                              onTap: _contactus,
                              btnColor: kNavy,
                              textcolor: Colors.white,
                              btnWidth: double.infinity,
                              btnHeight: 45,
                            ),

                            const SizedBox(height: 12),
                            // Terms Text
                            Padding(
                              padding: EdgeInsets.symmetric(horizontal: 20.w),
                              child: Center(
                                child: RichText(
                                  textAlign: TextAlign.center,
                                  text: TextSpan(
                                    style: appStyle(12, kGray, FontWeight.w400),
                                    children: [
                                      const TextSpan(
                                          text:
                                              'By contacting us, you agree to our '),
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
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),

                  // Customer Support Section
                  const SupportSection(
                    title: 'Customer Support',
                    discription:
                        'Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s.',
                  ),

                  const SizedBox(height: 24),

                  // Feedback Section
                  const SupportSection(
                    title: 'Feedback',
                    discription:
                        'Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s.',
                  ),

                  const SizedBox(height: 24),
                  // Media Inquiries Section
                  const SupportSection(
                    title: 'Media Inquiries',
                    discription:
                        'Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s.',
                  ),

                  const SizedBox(height: 24),

                  // Contact Information Card
                  const ContactInfoCard(),

                  const SizedBox(height: 24),

                  // Footer
                  const ContactusFooter()
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
