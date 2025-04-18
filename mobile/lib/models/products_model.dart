// To parse this JSON data, do
//
//     final productsModel = productsModelFromJson(jsonString);

import 'dart:convert';

ProductsModel productsModelFromJson(String str) =>
    ProductsModel.fromJson(json.decode(str));

String productsModelToJson(ProductsModel data) => json.encode(data.toJson());

class ProductsModel {
  final bool success;
  final List<Product> products;

  ProductsModel({
    required this.success,
    required this.products,
  });

  factory ProductsModel.fromJson(Map<String, dynamic> json) => ProductsModel(
        success: json["success"],
        products: List<Product>.from(
            json["products"].map((x) => Product.fromJson(x))),
      );

  Map<String, dynamic> toJson() => {
        "success": success,
        "products": List<dynamic>.from(products.map((x) => x.toJson())),
      };
}

class Product {
  final String id;
  final String name;
  final Brand category;
  final Brand brand;
  final String description;
  final int quantityInStock;
  final double price;
  final List<String> colors;
  final List<String> sizes;
  final bool isDiscounted;
  final int discountAmount;
  final bool isApproved;
  final List<Review> reviews;
  final DateTime createdAt;
  final DateTime updatedAt;
  final int v;

  Product({
    required this.id,
    required this.name,
    required this.category,
    required this.brand,
    required this.description,
    required this.quantityInStock,
    required this.price,
    required this.colors,
    required this.sizes,
    required this.isDiscounted,
    required this.discountAmount,
    required this.isApproved,
    required this.reviews,
    required this.createdAt,
    required this.updatedAt,
    required this.v,
  });

  factory Product.fromJson(Map<String, dynamic> json) => Product(
        id: json["_id"],
        name: json["name"],
        category: Brand.fromJson(json["category"]),
        brand: Brand.fromJson(json["brand"]),
        description: json["description"],
        quantityInStock: json["quantityInStock"],
        price: json["price"]?.toDouble(),
        colors: List<String>.from(json["colors"].map((x) => x)),
        sizes: List<String>.from(json["sizes"].map((x) => x)),
        isDiscounted: json["isDiscounted"],
        discountAmount: json["discountAmount"],
        isApproved: json["isApproved"],
        reviews:
            List<Review>.from(json["reviews"].map((x) => Review.fromJson(x))),
        createdAt: DateTime.parse(json["createdAt"]),
        updatedAt: DateTime.parse(json["updatedAt"]),
        v: json["__v"],
      );

  Map<String, dynamic> toJson() => {
        "_id": id,
        "name": name,
        "category": category.toJson(),
        "brand": brand.toJson(),
        "description": description,
        "quantityInStock": quantityInStock,
        "price": price,
        "colors": List<dynamic>.from(colors.map((x) => x)),
        "sizes": List<dynamic>.from(sizes.map((x) => x)),
        "isDiscounted": isDiscounted,
        "discountAmount": discountAmount,
        "isApproved": isApproved,
        "reviews": List<dynamic>.from(reviews.map((x) => x.toJson())),
        "createdAt": createdAt.toIso8601String(),
        "updatedAt": updatedAt.toIso8601String(),
        "__v": v,
      };
}

class Brand {
  final String id;
  final String name;
  final String? owner;
  final String? description;
  final DateTime createdAt;
  final DateTime updatedAt;
  final int v;

  Brand({
    required this.id,
    required this.name,
    this.owner,
    this.description,
    required this.createdAt,
    required this.updatedAt,
    required this.v,
  });

  factory Brand.fromJson(Map<String, dynamic> json) => Brand(
        id: json["_id"],
        name: json["name"],
        owner: json["owner"],
        description: json["description"],
        createdAt: DateTime.parse(json["createdAt"]),
        updatedAt: DateTime.parse(json["updatedAt"]),
        v: json["__v"],
      );

  Map<String, dynamic> toJson() => {
        "_id": id,
        "name": name,
        "owner": owner,
        "description": description,
        "createdAt": createdAt.toIso8601String(),
        "updatedAt": updatedAt.toIso8601String(),
        "__v": v,
      };
}

class Review {
  final String id;
  final String user;
  final int rating;
  final String reviewText;
  final List<dynamic> comments;
  final DateTime createdAt;
  final DateTime updatedAt;
  final int v;

  Review({
    required this.id,
    required this.user,
    required this.rating,
    required this.reviewText,
    required this.comments,
    required this.createdAt,
    required this.updatedAt,
    required this.v,
  });

  factory Review.fromJson(Map<String, dynamic> json) => Review(
        id: json["_id"],
        user: json["user"],
        rating: json["rating"],
        reviewText: json["reviewText"],
        comments: List<dynamic>.from(json["comments"].map((x) => x)),
        createdAt: DateTime.parse(json["createdAt"]),
        updatedAt: DateTime.parse(json["updatedAt"]),
        v: json["__v"],
      );

  Map<String, dynamic> toJson() => {
        "_id": id,
        "user": user,
        "rating": rating,
        "reviewText": reviewText,
        "comments": List<dynamic>.from(comments.map((x) => x)),
        "createdAt": createdAt.toIso8601String(),
        "updatedAt": updatedAt.toIso8601String(),
        "__v": v,
      };
}
