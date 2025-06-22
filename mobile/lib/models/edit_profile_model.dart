class EditProfileModel {
  final String name;
  final String phoneNumber;
  final String address;
  final String email;
  final String gender;

  final String currentPassword;
  final String newPassword;

  EditProfileModel({
    required this.name,
    required this.phoneNumber,
    required this.address,
    required this.gender,
    required this.email,
    required this.currentPassword,
    required this.newPassword,
  });

  factory EditProfileModel.fromJson(Map<String, dynamic> json) =>
      EditProfileModel(
        name: json["name"],
        phoneNumber: json["phoneNumber"],
        currentPassword: json["currentPassword"],
        gender: json["gender"],
        email: json["email"],
        address: json["address"],
        newPassword: json["newPassword"],
      );

  Map<String, dynamic> toJson() => {
        "name": name,
        "phoneNumber": phoneNumber,
        "email": email,
        "gender": gender,
        "currentPassword": currentPassword,
        "address": address,
        "newPassword": newPassword,
      };
}
