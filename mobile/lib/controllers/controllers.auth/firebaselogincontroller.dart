// import 'package:get/get.dart';
// import 'package:flutter/material.dart';
// import 'package:get_storage/get_storage.dart';
// import 'package:graduation_project1/constants/constants.dart';
// import 'package:graduation_project1/controllers/UserController.dart';
// import 'package:graduation_project1/data/repositories/NetworkManager.dart';
// import 'package:graduation_project1/data/repositories/authentication_repository.dart';

// class Firebaselogincontroller extends GetxController {
//   final RxBool _isLoading = false.obs;
//   final rememberme = false.obs;
//   final hidePassword = true.obs;
//   final localStorage = GetStorage();
//   final Email = TextEditingController();
//   final Password = TextEditingController();
//   GlobalKey<FormState> LoginFormKey = GlobalKey<FormState>();
//   final usercontroller = Get.put(UserController());

//   bool get isLoading => _isLoading.value;
//   set setLoading(bool newState) {
//     _isLoading.value = newState;
//   }

//   void emailAndpasswordSignin() async {
//     try {
//       final isConnected = await NetworkManager.instance.isConnected();
//       if (!isConnected) {
//         setLoading = false;
//         return;
//       }
//       if (!LoginFormKey.currentState!.validate()) {
//         setLoading = false;
//         return;
//       }

//       final userCredential = await AuthenticationRepository.instance
//           .loginWithEmailandPassword(Email.text.trim(), Password.text.trim());
//       AuthenticationRepository.instance.screenRedirect();
//       Get.snackbar(
//         'Welcome back...',
//         'We are happy to see you again',
//         colorText: kLightWhite,
//         backgroundColor: kLightBlue,
//       );
//     } catch (e) {
//       Get.snackbar('Opps....!', 'Make sure your email and password are correct',
//           colorText: kLightWhite,
//           backgroundColor: kRed,
//           icon: const Icon(Icons.error_outline));
//     }
//   }

//   Future<void> googleSignin() async {
//     try {
//       final isConnected = await NetworkManager.instance.isConnected();
//       if (!isConnected) {
//         return;
//       }
//       final userCredential =
//           await AuthenticationRepository.instance.signinwithGoogle();
//       await usercontroller.saveUserRecord(userCredential);
//       AuthenticationRepository.instance.screenRedirect();
//     } catch (e) {
//       Get.snackbar('Opps....!', 'Sorry, something went wrong please try again',
//           colorText: kLightWhite,
//           backgroundColor: kRed,
//           icon: const Icon(Icons.error_outline));
//     }
//   }
// }
