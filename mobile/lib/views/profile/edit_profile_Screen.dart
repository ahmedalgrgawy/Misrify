import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:get/get.dart';
import 'package:graduation_project1/common/app_style.dart';
import 'package:graduation_project1/common/custom_button.dart';
import 'package:graduation_project1/common/reusable_text.dart';
import 'package:graduation_project1/constants/constants.dart';
import 'package:graduation_project1/controllers/profile_controller.dart';
import 'package:graduation_project1/hooks/fetch_profile.dart';
import 'package:graduation_project1/views/profile/widgets/editprofile_text_container.dart';

class EditProfile extends HookWidget {
  const EditProfile({super.key});

  @override
  Widget build(BuildContext context) {
    final profileController = Get.put(ProfileController());
    final profileHook = useFetchProfile();
    final user = profileHook.data?.user;

    final formKey = useMemoized(() => GlobalKey<FormState>());
    final nameController = useTextEditingController();
    final genderController = useTextEditingController();
    final emailController = useTextEditingController();
    final phoneController = useTextEditingController();
    final newPasswordController = useTextEditingController();
    final currentPasswordController = useTextEditingController();
    final addressController = useTextEditingController();

    useEffect(() {
      if (user != null) {
        nameController.text = user.name ?? '';
        emailController.text = user.email ?? '';
        phoneController.text = user.phoneNumber ?? '';
        addressController.text = user.address ?? '';
        genderController.text = user.gender ?? '';
      }
      return null;
    }, [user]);

    if (profileHook.isLoading || user == null) {
      return const Scaffold(
        body: Center(child: CircularProgressIndicator()),
      );
    }

    void handleUpdate() async {
      profileController.fieldErrors.clear();
      profileController.generalError.value = '';

      final name = nameController.text.trim();
      final email = emailController.text.trim();
      final phone = phoneController.text.trim();
      final address = addressController.text.trim();
      final gender = genderController.text.trim();
      final currentPassword = currentPasswordController.text.trim();
      final newPassword = newPasswordController.text.trim();

      final noChange = name == (user.name ?? '') &&
          email == (user.email ?? '') &&
          phone == (user.phoneNumber ?? '') &&
          address == (user.address ?? '') &&
          gender == (user.gender ?? '') &&
          currentPassword.isEmpty &&
          newPassword.isEmpty;

      if (noChange) {
        Get.snackbar(
          "Info",
          "No data changed",
          backgroundColor: Colors.orange,
          colorText: Colors.white,
        );
        return;
      }

      if ((currentPassword.isNotEmpty && newPassword.isEmpty) ||
          (newPassword.isNotEmpty && currentPassword.isEmpty)) {
        Get.snackbar(
          "Error",
          "Both current and new passwords must be provided",
          backgroundColor: Colors.red,
          colorText: Colors.white,
        );
        return;
      }

      await profileController.updateProfile(
        name: name,
        email: email,
        phoneNumber: phone,
        address: address,
        gender: gender,
        currentPassword: currentPassword.isNotEmpty ? currentPassword : null,
        newPassword: newPassword.isNotEmpty ? newPassword : null,
        onSuccess: profileHook.refetch,
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
                    alignment: Alignment.bottomRight,
                    children: [
                      CircleAvatar(
                        radius: 60,
                        backgroundImage: user.imgUrl != null
                            ? NetworkImage(user.imgUrl!)
                            : const NetworkImage(
                                "https://images.unsplash.com/photo-1563389234808-52344934935c?q=80",
                              ),
                      ),
                      GestureDetector(
                        onTap: () async {
                          await profileController.pickImageAndUpdateProfile(
                            name: nameController.text.trim(),
                            phoneNumber: phoneController.text.trim(),
                            address: addressController.text.trim(),
                            email: emailController.text.trim(),
                            gender: genderController.text.trim(),
                            currentPassword:
                                currentPasswordController.text.trim(),
                            newPassword: newPasswordController.text.trim(),
                          );
                          await profileHook.refetch!();
                        },
                        child: Container(
                          padding: const EdgeInsets.all(6),
                          decoration: const BoxDecoration(
                            color: Colors.white,
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(
                            Icons.camera_alt_outlined,
                            size: 16,
                            color: kDarkBlue,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  ReusableText(
                    text: user.name ?? '',
                    style: appStyle(22, kDarkBlue, FontWeight.w600),
                  ),
                  const SizedBox(height: 8),
                  ReusableText(
                    text: user.email ?? '',
                    style: appStyle(14, kLightBlue, FontWeight.w500),
                  ),
                ],
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(24),
              child: Form(
                key: formKey,
                child: Column(
                  children: [
                    EditprofileTextContainer(
                      label: 'Name',
                      controller: nameController,
                      errorText: profileController.fieldErrors['name'],
                    ),
                    const SizedBox(height: 24),
                    EditprofileTextContainer(
                      label: 'Email',
                      controller: emailController,
                      errorText: profileController.fieldErrors['email'],
                    ),
                    const SizedBox(height: 24),
                    EditprofileTextContainer(
                      label: 'Gender',
                      controller: genderController,
                      errorText: profileController.fieldErrors['gender'],
                    ),
                    const SizedBox(height: 24),
                    EditprofileTextContainer(
                      label: 'Phone Number',
                      controller: phoneController,
                      errorText: profileController.fieldErrors['phoneNumber'],
                    ),
                    const SizedBox(height: 24),
                    EditprofileTextContainer(
                      label: 'Current Password',
                      controller: currentPasswordController,
                      obscureText: true,
                      errorText: profileController.fieldErrors['password'],
                    ),
                    const SizedBox(height: 24),
                    EditprofileTextContainer(
                      label: 'New Password',
                      controller: newPasswordController,
                      obscureText: true,
                      errorText: profileController.fieldErrors['password'],
                    ),
                    const SizedBox(height: 24),
                    EditprofileTextContainer(
                      label: 'Address',
                      controller: addressController,
                      errorText: profileController.fieldErrors['address'],
                    ),
                    const SizedBox(height: 40),
                    CustomButton(
                      text: 'Update',
                      onTap: handleUpdate,
                      btnColor: kNavy,
                      textcolor: Colors.white,
                      btnWidth: double.infinity,
                      btnHeight: 45,
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
