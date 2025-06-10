import 'dart:convert';

ContactUsModel contactUsModelFromJson(String str) =>
    ContactUsModel.fromJson(json.decode(str));

String contactUsModelToJson(ContactUsModel data) => json.encode(data.toJson());

class ContactUsModel {
  final String firstName;
  final String lastName;
  final String email;
  final String phone;
  final String message;

  ContactUsModel({
    required this.firstName,
    required this.lastName,
    required this.email,
    required this.phone,
    required this.message,
  });

  factory ContactUsModel.fromJson(Map<String, dynamic> json) => ContactUsModel(
        firstName: json["firstName"],
        lastName: json["lastName"],
        email: json["email"],
        phone: json["phone"],
        message: json["message"],
      );

  Map<String, dynamic> toJson() => {
        "firstName": firstName,
        "lastName": lastName,
        "email": email,
        "phone": phone,
        "message": message,
      };
}
