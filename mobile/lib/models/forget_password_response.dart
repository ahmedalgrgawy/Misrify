import 'dart:convert';

ForgetPasswordResponse forgetPasswordResponseFromJson(String str) =>
    ForgetPasswordResponse.fromJson(json.decode(str));

String forgetPasswordResponseToJson(ForgetPasswordResponse data) =>
    json.encode(data.toJson());

class ForgetPasswordResponse {
  final bool success;
  final String message;
  final int otp;

  ForgetPasswordResponse({
    required this.success,
    required this.message,
    required this.otp,
  });

  factory ForgetPasswordResponse.fromJson(Map<String, dynamic> json) =>
      ForgetPasswordResponse(
        success: json["success"],
        message: json["message"],
        otp: json["otp"],
      );

  Map<String, dynamic> toJson() => {
        "success": success,
        "message": message,
        "otp": otp,
      };
}
