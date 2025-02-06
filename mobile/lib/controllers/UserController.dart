// import 'package:firebase_auth/firebase_auth.dart';
// import 'package:flutter/material.dart';
// import 'package:get/get.dart';
// import 'package:graduation_project1/constants/constants.dart';
// import 'package:graduation_project1/data/repositories/NetworkManager.dart';
// import 'package:graduation_project1/data/repositories/UserRepositories.dart';
// import 'package:graduation_project1/data/repositories/authentication_repository.dart';
// import 'package:graduation_project1/models/user_model.dart';
// import 'package:graduation_project1/views/auth/login_Screen.dart';
// import 'package:graduation_project1/views/auth/verification_screen.dart';
// import 'package:image_picker/image_picker.dart';

// class UserController extends GetxController {
//   static UserController get instance => Get.find();

// //loaders
//   final profileLoading = false.obs;
//   final imageuploading = false.obs;

//   final hidePassword = false.obs;
//   final verifyEmail = TextEditingController();
//   final verifyPassword = TextEditingController();

//   final user = UserModel.empty().obs;
//   final userRepostry = Get.put(UserRepoistory());
//   GlobalKey<FormState> reAuthFormKey = GlobalKey<FormState>();

//   @override
//   void onInit() {
//     fetchUserRecord();
//     super.onInit();
//   }

//   Future<void> fetchUserRecord() async {
//     try {
//       profileLoading.value = true;
//       final user = await userRepostry.fetchUserDetails();
//       this.user(user);
//     } catch (e) {
//       user(UserModel.empty());
//     } finally {
//       profileLoading.value = false;
//     }
//   }

//   Future<void> saveUserRecord(UserCredential? userCredential) async {
//     try {
//       // Return early if userCredential is null
//       if (userCredential == null || userCredential.user == null) {
//         Get.snackbar(
//           'Sign-In Failed',
//           'User credentials not found.',
//           colorText: kLightWhite,
//           backgroundColor: kRed,
//           icon: const Icon(Icons.error_outline),
//         );
//         return;
//       }

//       await fetchUserRecord(); // Ensure user data is fetched before proceeding

//       // Ensure user object is initialized before checking id
//       if (user.value.id.isEmpty) {
//         final newUser = UserModel(
//           id: userCredential.user!.uid,
//           name: userCredential.user!.displayName ?? 'Unknown',
//           email: userCredential.user!.email ?? '',
//           phoneNumber: userCredential.user!.phoneNumber ?? '',
//           address: '',
//           gender: '',
//           role: '',
//           points: 0, // Default to 0 if points are not available
//           purchaseHistory: [],
//           recommendedProduct: [],
//           isVerified: false, // Default to false if not specified
//           otp: null,
//           otpExpiry: null,
//           createdAt: DateTime.now(),
//           updatedAt: DateTime.now(),
//           v: 1, // Default version number
//         );

//         // Save to MongoDB instead of Firestore
//         await userRepostry.saveUserRecord(newUser);

//         Get.snackbar(
//           'Success',
//           'User information saved successfully!',
//           colorText: kLightWhite,
//           backgroundColor: Colors.green,
//           icon: const Icon(Icons.check_circle_outline),
//         );
//       }
//     } catch (e) {
//       Get.snackbar(
//         'Data Not Saved',
//         'Something went wrong while saving your information: $e',
//         colorText: kLightWhite,
//         backgroundColor: kRed,
//         icon: const Icon(Icons.error_outline),
//       );
//       print('Error in saveUserRecord: $e');
//     }
//   }

//   uploadUserProfilePicture() async {
//     try {
//       final image = await ImagePicker().pickImage(
//           source: ImageSource.gallery,
//           imageQuality: 70,
//           maxHeight: 550,
//           maxWidth: 550);
//       if (image != null) {
//         imageuploading.value = true;
//         final imageurl =
//             await userRepostry.uploadImage('Users/Images/Profile/', image);
//         Map<String, dynamic> json = {'ProfilePicture': imageurl};
//         await userRepostry.updateSingleField(json);

//         user.refresh();
//         Get.snackbar(
//           'Congratulation',
//           'Your Profile image has been updated',
//           colorText: kLightWhite,
//           backgroundColor: kLightBlue,
//         );
//       }
//     } catch (e) {
//       throw 'Something went wrong. Please try again';
//     } finally {
//       imageuploading.value = false;
//     }
//   }

//   void deleteAccountWarningPopup() {
//     Get.defaultDialog(
//         backgroundColor: Colors.white,
//         contentPadding: const EdgeInsets.all(12),
//         title: 'Delete Account',
//         titleStyle: const TextStyle(
//             color: kGray, fontSize: 19, fontWeight: FontWeight.w600),
//         middleText: 'Are you sure you want to delete your account?',
//         middleTextStyle: const TextStyle(
//           color: kGray,
//           fontSize: 15,
//         ),
//         confirm: ElevatedButton(
//           onPressed: () async => deleteUserAccount(),
//           style: ElevatedButton.styleFrom(backgroundColor: kBlue),
//           child: const Text(
//             'Delete',
//             style: TextStyle(color: Colors.white, fontSize: 15),
//           ),
//         ),
//         cancel: OutlinedButton(
//             onPressed: () => Navigator.of(Get.overlayContext!).pop,
//             style: OutlinedButton.styleFrom(backgroundColor: Colors.white),
//             child: const Text(
//               'Cancel',
//               style: TextStyle(color: kBlue, fontSize: 15),
//             )));
//   }

//   void deleteUserAccount() async {
//     try {
//       final auth = AuthenticationRepository.instance;
//       final provider =
//           auth.authUser!.providerData.map((e) => e.providerId).first;
//       if (provider.isNotEmpty) {
//         if (provider == 'google.com') {
//           await auth.signinwithGoogle();
//           await auth.deleteAccount();
//           Get.offAll(() => const LoginScreen());
//         } else if (provider == 'password') {
//           Get.to(() => const VerificationScreen());
//         }
//       }
//     } catch (e) {
//       Get.snackbar('Opps....!', 'Something went wrong',
//           colorText: kLightWhite,
//           backgroundColor: kRed,
//           icon: const Icon(Icons.error_outline));
//     }
//   }

//   Future<void> reAuthenticateEmailAndPasswordUser() async {
//     try {
//       final isConnected = await NetworkManager.instance.isConnected();
//       if (!isConnected) {
//         return;
//       }
//       if (!reAuthFormKey.currentState!.validate()) {
//         return;
//       }
//       await AuthenticationRepository.instance
//           .reAuthenticateWithEmailAndPassword(
//               verifyEmail.text.trim(), verifyPassword.text.trim());
//       await AuthenticationRepository.instance.deleteAccount();
//       Get.offAll(() => const LoginScreen());
//     } catch (e) {
//       Get.snackbar('Opps....!', 'Something went wrong',
//           colorText: kLightWhite,
//           backgroundColor: kRed,
//           icon: const Icon(Icons.error_outline));
//     }
//   }
// }
