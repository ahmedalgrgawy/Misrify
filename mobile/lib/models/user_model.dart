// // To parse this JSON data, do
// //
// //     final userModel = userModelFromJson(jsonString);

// import 'package:cloud_firestore/cloud_firestore.dart';
// import 'package:meta/meta.dart';
// import 'dart:convert';

// UserModel userModelFromJson(String str) => UserModel.fromJson(json.decode(str));

// String userModelToJson(UserModel data) => json.encode(data.toJson());

// class UserModel {
//   final String id;
//   final String name;
//   final String email;
//   final String phoneNumber;
//   final String address;
//   final String gender;
//   final String role;
//   final int? points;
//   final List<dynamic> purchaseHistory;
//   final List<dynamic> recommendedProduct;
//   final bool? isVerified;
//   final dynamic otp;
//   final dynamic otpExpiry;
//   final DateTime? createdAt;
//   final DateTime? updatedAt;
//   final int? v;

//   UserModel({
//     required this.id,
//     required this.name,
//     required this.email,
//     required this.phoneNumber,
//     required this.address,
//     required this.gender,
//     required this.role,
//     required this.points,
//     required this.purchaseHistory,
//     required this.recommendedProduct,
//     required this.isVerified,
//     required this.otp,
//     required this.otpExpiry,
//     required this.createdAt,
//     required this.updatedAt,
//     required this.v,
//   });

//   factory UserModel.fromJson(Map<String, dynamic> json) => UserModel(
//         id: json["_id"],
//         name: json["name"],
//         email: json["email"],
//         phoneNumber: json["phoneNumber"],
//         address: json["address"],
//         gender: json["gender"],
//         role: json["role"],
//         points: json["points"],
//         purchaseHistory:
//             List<dynamic>.from(json["purchaseHistory"].map((x) => x)),
//         recommendedProduct:
//             List<dynamic>.from(json["recommendedProduct"].map((x) => x)),
//         isVerified: json["isVerified"],
//         otp: json["otp"],
//         otpExpiry: json["otpExpiry"],
//         createdAt: DateTime.parse(json["createdAt"]),
//         updatedAt: DateTime.parse(json["updatedAt"]),
//         v: json["__v"],
//       );

//   Map<String, dynamic> toJson() => {
//         "_id": id,
//         "name": name,
//         "email": email,
//         "phoneNumber": phoneNumber,
//         "address": address,
//         "gender": gender,
//         "role": role,
//         "points": points,
//         "purchaseHistory": List<dynamic>.from(purchaseHistory.map((x) => x)),
//         "recommendedProduct":
//             List<dynamic>.from(recommendedProduct.map((x) => x)),
//         "isVerified": isVerified,
//         "otp": otp,
//         "otpExpiry": otpExpiry,
//         "createdAt": createdAt!.toIso8601String(),
//         "updatedAt": updatedAt!.toIso8601String(),
//         "__v": v,
//       };
//   static UserModel empty() => UserModel(
//       id: '',
//       name: '',
//       address: '',
//       phoneNumber: '',
//       email: '',
//       gender: '',
//       points: 0,
//       role: '',
//       purchaseHistory: [],
//       recommendedProduct: [],
//       isVerified: null,
//       otp: null,
//       otpExpiry: null,
//       createdAt: null,
//       updatedAt: null,
//       v: 0);

//   factory UserModel.fromSnapshot(
//       DocumentSnapshot<Map<String, dynamic>> document) {
//     if (document.data() != null) {
//       final data = document.data()!;
//       return UserModel(
//         id: document.id,
//         name: data['name'] ?? '',
//         address: data['address'] ?? '',
//         gender: data['gender'] ?? '',
//         email: data['email'] ?? '',
//         phoneNumber: data['phoneNumber'] ?? '',
//         role: data['role'] ?? '',
//         points: data['points'] ?? '',
//         purchaseHistory: data['purchaseHistory'] ?? '',
//         recommendedProduct: data['recommendedProduct'] ?? '',
//         isVerified: data['isVerified'] ?? '',
//         otp: data['otp'] ?? '',
//         otpExpiry: data['otpExpiry'] ?? '',
//         createdAt: data['createdAt'] ?? '',
//         updatedAt: data['updatedAt'] ?? '',
//         v: data['__v'] ?? '',
//       );
//     } else {
//       return UserModel.empty();
//     }
//   }
// }
