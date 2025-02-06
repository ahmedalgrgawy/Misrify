import 'dart:convert';

LoginResponse loginResponseFromJson(String str) =>
    LoginResponse.fromJson(json.decode(str));

String loginResponseToJson(LoginResponse data) => json.encode(data.toJson());

class LoginResponse {
  final bool success;
  final String message;
  final User user;

  LoginResponse({
    required this.success,
    required this.message,
    required this.user,
  });

  factory LoginResponse.fromJson(Map<String, dynamic> json) => LoginResponse(
        success: json["success"],
        message: json["message"],
        user: User.fromJson(json["user"]),
      );

  Map<String, dynamic> toJson() => {
        "success": success,
        "message": message,
        "user": user.toJson(),
      };
}

class User {
  final String id;
  final String name;
  final String email;
  final String phoneNumber;
  final String address;
  final String gender;
  final String role;
  final int points;
  final List<dynamic> purchaseHistory;
  final List<dynamic> recommendedProduct;
  final bool isVerified;
  final dynamic otp;
  final dynamic otpExpiry;
  final DateTime createdAt;
  final DateTime updatedAt;
  final int v;

  User({
    required this.id,
    required this.name,
    required this.email,
    required this.phoneNumber,
    required this.address,
    required this.gender,
    required this.role,
    required this.points,
    required this.purchaseHistory,
    required this.recommendedProduct,
    required this.isVerified,
    required this.otp,
    required this.otpExpiry,
    required this.createdAt,
    required this.updatedAt,
    required this.v,
  });

  factory User.fromJson(Map<String, dynamic> json) => User(
        id: json["_id"],
        name: json["name"],
        email: json["email"],
        phoneNumber: json["phoneNumber"],
        address: json["address"],
        gender: json["gender"],
        role: json["role"],
        points: json["points"],
        purchaseHistory:
            List<dynamic>.from(json["purchaseHistory"].map((x) => x)),
        recommendedProduct:
            List<dynamic>.from(json["recommendedProduct"].map((x) => x)),
        isVerified: json["isVerified"],
        otp: json["otp"],
        otpExpiry: json["otpExpiry"],
        createdAt: DateTime.parse(json["createdAt"]),
        updatedAt: DateTime.parse(json["updatedAt"]),
        v: json["__v"],
      );

  Map<String, dynamic> toJson() => {
        "_id": id,
        "name": name,
        "email": email,
        "phoneNumber": phoneNumber,
        "address": address,
        "gender": gender,
        "role": role,
        "points": points,
        "purchaseHistory": List<dynamic>.from(purchaseHistory.map((x) => x)),
        "recommendedProduct":
            List<dynamic>.from(recommendedProduct.map((x) => x)),
        "isVerified": isVerified,
        "otp": otp,
        "otpExpiry": otpExpiry,
        "createdAt": createdAt.toIso8601String(),
        "updatedAt": updatedAt.toIso8601String(),
        "__v": v,
      };
}
