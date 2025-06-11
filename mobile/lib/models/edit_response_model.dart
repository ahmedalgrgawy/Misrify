class EditResponseModel {
  final bool success;
  final String message;
  final User user;

  EditResponseModel({
    required this.success,
    required this.message,
    required this.user,
  });
}

class User {
  final String id;
  final String name;
  final String email;
  final dynamic password;
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
  final dynamic resetPasswordOtp;
  final dynamic resetPasswordOtpExpiry;

  User({
    required this.id,
    required this.name,
    required this.email,
    required this.password,
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
    required this.resetPasswordOtp,
    required this.resetPasswordOtpExpiry,
  });
}
