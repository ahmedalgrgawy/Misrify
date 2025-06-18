import 'dart:convert';

SuccessModel successModelFromJson(String str) =>
    SuccessModel.fromJson(json.decode(str));

String successModelToJson(SuccessModel data) => json.encode(data.toJson());

class SuccessModel {
  final bool success;
  final String message;

  SuccessModel({
    required this.success,
    required this.message,
  });

  factory SuccessModel.fromJson(Map<String, dynamic> json) => SuccessModel(
        success: json["success"],
        message: json["message"],
      );

  Map<String, dynamic> toJson() => {
        "success": success,
        "message": message,
      };
}
