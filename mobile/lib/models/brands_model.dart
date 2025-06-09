import 'package:meta/meta.dart';
import 'dart:convert';

BransModel bransModelFromJson(String str) =>
    BransModel.fromJson(json.decode(str));

String bransModelToJson(BransModel data) => json.encode(data.toJson());

class BransModel {
  final bool success;
  final List<Brand> brands;

  BransModel({
    required this.success,
    required this.brands,
  });

  factory BransModel.fromJson(Map<String, dynamic> json) => BransModel(
        success: json["success"],
        brands: List<Brand>.from(json["Brands"].map((x) => Brand.fromJson(x))),
      );

  Map<String, dynamic> toJson() => {
        "success": success,
        "Brands": List<dynamic>.from(brands.map((x) => x.toJson())),
      };
}

class Brand {
  final String id;
  final String name;
  final Owner owner;
  final String description;
  final DateTime createdAt;
  final DateTime updatedAt;
  final int v;

  Brand({
    required this.id,
    required this.name,
    required this.owner,
    required this.description,
    required this.createdAt,
    required this.updatedAt,
    required this.v,
  });

  factory Brand.fromJson(Map<String, dynamic> json) => Brand(
        id: json["_id"],
        name: json["name"],
        owner: Owner.fromJson(json["owner"]),
        description: json["description"],
        createdAt: DateTime.parse(json["createdAt"]),
        updatedAt: DateTime.parse(json["updatedAt"]),
        v: json["__v"],
      );

  factory Brand.empty() => Brand(
        // ✅ Add this method
        id: '',
        name: '',
        owner: Owner(
          id: '',
          name: '',
          email: '',
          phoneNumber: '',
          address: '',
        ),
        description: '',
        createdAt: DateTime.now(),
        updatedAt: DateTime.now(),
        v: 0,
      );

  Map<String, dynamic> toJson() => {
        "_id": id,
        "name": name,
        "owner": owner.toJson(),
        "description": description,
        "createdAt": createdAt.toIso8601String(),
        "updatedAt": updatedAt.toIso8601String(),
        "__v": v,
      };
}

class Owner {
  final String id;
  final String name;
  final String email;
  final String phoneNumber;
  final String address;

  Owner({
    required this.id,
    required this.name,
    required this.email,
    required this.phoneNumber,
    required this.address,
  });

  factory Owner.fromJson(Map<String, dynamic> json) => Owner(
        id: json["_id"],
        name: json["name"],
        email: json["email"],
        phoneNumber: json["phoneNumber"],
        address: json["address"],
      );

  Map<String, dynamic> toJson() => {
        "_id": id,
        "name": name,
        "email": email,
        "phoneNumber": phoneNumber,
        "address": address,
      };
}
