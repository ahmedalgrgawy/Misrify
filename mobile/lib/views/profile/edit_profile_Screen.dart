import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:get/get.dart';
import 'package:graduation_project1/common/app_style.dart';
import 'package:graduation_project1/common/reusable_text.dart';
import 'package:graduation_project1/constants/constants.dart';
import 'package:graduation_project1/controllers/controllers.auth/login_controller.dart';
import 'package:graduation_project1/hooks/fetch_profile.dart';

class EditProfile extends HookWidget {
  const EditProfile({super.key});

  @override
  Widget build(BuildContext context) {
    final profileHook = useFetchProfile();
    final user = profileHook.data?.user;

    final _formKey = useMemoized(() => GlobalKey<FormState>());
    final _firstNameController = useTextEditingController();
    final _emailController = useTextEditingController();
    final _phoneController = useTextEditingController();
    final _passwordController = useTextEditingController();
    final _cityController = useTextEditingController();

    useEffect(() {
      if (user != null) {
        _firstNameController.text = user.name ?? '';
        _emailController.text = user.email ?? '';
        _phoneController.text = user.phoneNumber ?? '';
        _cityController.text = user.address ?? '';
      }
      return null;
    }, [user]);

    void _updateProfile() {
      if (_formKey.currentState!.validate()) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Profile updated successfully!'),
            backgroundColor: Colors.green,
          ),
        );
      }
    }

    Widget _buildTextField({
      required String label,
      required TextEditingController controller,
      bool obscureText = false,
      TextInputType keyboardType = TextInputType.text,
    }) {
      return Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          ReusableText(
              text: label, style: appStyle(14, kBlue, FontWeight.w400)),
          const SizedBox(height: 6),
          Container(
            decoration: BoxDecoration(
              color: const Color(0xFFF5F5F5),
              borderRadius: BorderRadius.circular(8),
              border: Border.all(color: Colors.grey.shade300),
            ),
            child: TextFormField(
              controller: controller,
              obscureText: obscureText,
              keyboardType: keyboardType,
              style: appStyle(14, kBlue, FontWeight.w400),
              decoration: InputDecoration(
                filled: true,
                fillColor: kLightWhite.withOpacity(0.45),
                border: OutlineInputBorder(
                  borderSide: BorderSide(color: Kbackground, width: .5),
                ),
                enabledBorder: OutlineInputBorder(
                  borderSide: BorderSide(color: Kbackground, width: .5),
                ),
                focusedBorder: OutlineInputBorder(
                  borderSide: BorderSide(color: kLightGray, width: .5),
                ),
                contentPadding:
                    EdgeInsets.symmetric(vertical: 10.h, horizontal: 12.w),
              ),
            ),
          ),
        ],
      );
    }

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: KTextColor),
          onPressed: () => Get.back(),
        ),
        title: ReusableText(
          text: 'Edit profile',
          style: appStyle(18, KTextColor, FontWeight.w600),
        ),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(vertical: 40),
              child: Column(
                children: [
                  Stack(
                    children: [
                      const CircleAvatar(
                        radius: 60,
                        backgroundImage: NetworkImage(
                          "https://images.unsplash.com/photo-1563389234808-52344934935c?q=80",
                        ),
                      ),
                      Positioned(
                        bottom: 0,
                        right: 0,
                        child: Container(
                          padding: const EdgeInsets.all(8),
                          decoration: const BoxDecoration(
                            color: Colors.white,
                            shape: BoxShape.circle,
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black26,
                                blurRadius: 4,
                                offset: Offset(0, 2),
                              ),
                            ],
                          ),
                          child: const Icon(Icons.camera_alt, size: 20),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  ReusableText(
                    text: user?.name ?? 'Loading...',
                    style: appStyle(22, kDarkBlue, FontWeight.w600),
                  ),
                  const SizedBox(height: 8),
                  ReusableText(
                    text: user?.email ?? '',
                    style: appStyle(14, kLightBlue, FontWeight.w500),
                  ),
                ],
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(24),
              child: Form(
                key: _formKey,
                child: Column(
                  children: [
                    _buildTextField(
                        label: 'Name', controller: _firstNameController),
                    const SizedBox(height: 24),
                    _buildTextField(
                        label: 'Email',
                        controller: _emailController,
                        keyboardType: TextInputType.emailAddress),
                    const SizedBox(height: 24),
                    _buildTextField(
                        label: 'Phone Number',
                        controller: _phoneController,
                        keyboardType: TextInputType.phone),
                    const SizedBox(height: 24),
                    _buildTextField(
                        label: 'Password',
                        controller: _passwordController,
                        obscureText: true),
                    const SizedBox(height: 24),
                    _buildTextField(
                        label: 'Address', controller: _cityController),
                    const SizedBox(height: 40),
                    SizedBox(
                      width: double.infinity,
                      height: 56,
                      child: ElevatedButton(
                        onPressed: _updateProfile,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF2C3E50),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                        child: const Text(
                          'Update',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 18,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 20),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
