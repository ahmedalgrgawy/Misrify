// import 'dart:io';

// import 'package:cloud_firestore/cloud_firestore.dart';
// import 'package:firebase_storage/firebase_storage.dart';
// import 'package:flutter/services.dart';
// import 'package:get/get.dart';
// import 'package:graduation_project1/data/repositories/authentication_repository.dart';
// import 'package:graduation_project1/models/user_model.dart';
// import 'package:image_picker/image_picker.dart';

// class UserRepoistory extends GetxController {
//   static UserRepoistory get instance => Get.find();

//   final FirebaseFirestore _db = FirebaseFirestore.instance;

//   //save user data
//   Future<void> saveUserRecord(UserModel user) async {
//     try {
//       await _db.collection("Users").doc(user.id).set(user.toJson());
//     } on FirebaseException catch (e) {
//       throw FirebaseException(plugin: '$e');
//     } on FormatException catch (_) {
//       throw const FormatException();
//     } on PlatformException catch (e) {
//       throw PlatformException(code: '$e');
//     } catch (e) {
//       throw 'Something went wrong. Please try again';
//     }
//   }

//   //fetch user data based on id
//   Future<UserModel> fetchUserDetails() async {
//     try {
//       final documentSnapshot = await _db
//           .collection("Users")
//           .doc(AuthenticationRepository.instance.authUser?.uid)
//           .get();
//       if (documentSnapshot.exists) {
//         return UserModel.fromSnapshot(documentSnapshot);
//       } else {
//         return UserModel.empty();
//       }
//     } on FirebaseException catch (e) {
//       throw FirebaseException(plugin: '$e');
//     } on FormatException catch (_) {
//       throw const FormatException();
//     } on PlatformException catch (e) {
//       throw PlatformException(code: '$e');
//     } catch (e) {
//       throw 'Something went wrong. Please try again';
//     }
//   }

//   //update user data
//   Future<void> updateUserDetails(UserModel updatedUser) async {
//     try {
//       await _db
//           .collection("Users")
//           .doc(updatedUser.id)
//           .update(updatedUser.toJson());
//     } on FirebaseException catch (e) {
//       throw FirebaseException(plugin: '$e');
//     } on FormatException catch (_) {
//       throw const FormatException();
//     } on PlatformException catch (e) {
//       throw PlatformException(code: '$e');
//     } catch (e) {
//       throw 'Something went wrong. Please try again';
//     }
//   }

//   //update any field of user data
//   Future<void> updateSingleField(Map<String, dynamic> json) async {
//     try {
//       await _db
//           .collection("Users")
//           .doc(AuthenticationRepository.instance.authUser?.uid)
//           .update(json);
//     } on FirebaseException catch (e) {
//       throw FirebaseException(plugin: '$e');
//     } on FormatException catch (_) {
//       throw const FormatException();
//     } on PlatformException catch (e) {
//       throw PlatformException(code: '$e');
//     } catch (e) {
//       throw 'Something went wrong. Please try again';
//     }
//   }

//   //delete user
//   Future<void> removeUserRecord(String userID) async {
//     try {
//       await _db.collection("Users").doc(userID).delete();
//     } on FirebaseException catch (e) {
//       throw FirebaseException(plugin: '$e');
//     } on FormatException catch (_) {
//       throw const FormatException();
//     } on PlatformException catch (e) {
//       throw PlatformException(code: '$e');
//     } catch (e) {
//       throw 'Something went wrong. Please try again';
//     }
//   }

//   //upload image
//   Future<String> uploadImage(String path, XFile image) async {
//     try {
//       final ref = FirebaseStorage.instance.ref(path).child(image.name);
//       await ref.putFile(File(image.path));
//       final url = await ref.getDownloadURL();
//       return url;
//     } on FirebaseException catch (e) {
//       throw FirebaseException(plugin: '$e');
//     } on FormatException catch (_) {
//       throw const FormatException();
//     } on PlatformException catch (e) {
//       throw PlatformException(code: '$e');
//     } catch (e) {
//       throw 'Something went wrong. Please try again';
//     }
//   }
// }
