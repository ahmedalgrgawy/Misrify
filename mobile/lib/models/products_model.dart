import 'dart:convert';
import 'wishlist_response.dart'; // Import this to use WishlistItem

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
        success: json["success"] ?? false,
        products: json["products"] != null
            ? List<Product>.from(
                json["products"].map((x) => Product.fromJson(x)))
            : [],
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
  final String? imgUrl;
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
    this.imgUrl,
    required this.updatedAt,
    required this.v,
  });

  factory Product.fromJson(Map<String, dynamic> json) => Product(
        id: json["_id"] ?? '',
        imgUrl: json["imgUrl"],
        name: json["name"] ?? '',
        category: json["category"] != null
            ? Brand.fromJson(json["category"])
            : Brand.empty(),
        brand: json["brand"] != null
            ? Brand.fromJson(json["brand"])
            : Brand.empty(),
        description: json["description"] ?? '',
        quantityInStock: json["quantityInStock"] ?? 0,
        price: (json["price"] != null
                ? double.tryParse(json["price"].toString())
                : null) ??
            0.0,
        colors: json["colors"] != null
            ? List<String>.from(json["colors"].map((x) => x.toString()))
            : [],
        sizes: json["sizes"] != null
            ? List<String>.from(json["sizes"].map((x) => x.toString()))
            : [],
        isDiscounted: json["isDiscounted"] ?? false,
        discountAmount: json["discountAmount"] ?? 0,
        isApproved: json["isApproved"] ?? false,
        reviews: json["reviews"] != null
            ? List<Review>.from(json["reviews"].map((x) {
                if (x is Map<String, dynamic>) {
                  return Review.fromJson(x);
                } else {
                  return Review(
                    id: x.toString(),
                    user: '',
                    rating: 0,
                    reviewText: '',
                    comments: [],
                    createdAt: DateTime.now(),
                    updatedAt: DateTime.now(),
                    v: 0,
                  );
                }
              }))
            : [],
        createdAt: DateTime.tryParse(json["createdAt"] ?? '') ?? DateTime(2000),
        updatedAt: DateTime.tryParse(json["updatedAt"] ?? '') ?? DateTime.now(),
        v: json["__v"] ?? 0,
      );

  Map<String, dynamic> toJson() => {
        "_id": id,
        "imgUrl": imgUrl,
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

  /// ✅ Create a Product from a WishlistItem (for detail screen use)
  factory Product.fromWishlistItem(WishlistItem item) => Product(
        id: item.id,
        name: item.name,
        category: Brand(
          id: '',
          name: item.category,
          owner: '',
          description: '',
          createdAt: DateTime.now(), // fallback value
          updatedAt: DateTime.now(), // fallback value
          v: 0,
        ),
        brand: Brand(
          id: item.brand.id,
          name: item.brand.name,
          owner: '',
          description: '',
          createdAt: DateTime.now(),
          updatedAt: DateTime.now(),
          v: 0,
        ),
        description: item.description,
        quantityInStock: item.quantityInStock,
        price: item.price,
        colors: item.colors,
        sizes: item.sizes,
        isDiscounted: item.isDiscounted,
        discountAmount: item.discountAmount,
        isApproved: item.isApproved,
        reviews: [],
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        v: item.v,
      );
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
        id: json["_id"] ?? '',
        name: json["name"] ?? '',
        owner: json["owner"],
        description: json["description"],
        createdAt: DateTime.tryParse(json["createdAt"] ?? '') ?? DateTime.now(),
        updatedAt: DateTime.tryParse(json["updatedAt"] ?? '') ?? DateTime.now(),
        v: json["__v"] ?? 0,
      );

  factory Brand.empty() => Brand(
        id: '',
        name: '',
        owner: '',
        description: '',
        createdAt: DateTime.now(),
        updatedAt: DateTime.now(),
        v: 0,
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
        id: json["_id"] ?? '',
        user: json["user"] ?? '',
        rating: json["rating"] ?? 0,
        reviewText: json["reviewText"] ?? json["content"] ?? '',
        comments: json["comments"] != null
            ? List<dynamic>.from(
                json["comments"].map((x) {
                  if (x is Map<String, dynamic>) {
                    return x["text"] ?? x.toString(); // full object
                  } else {
                    return x.toString(); // just ID
                  }
                }),
              )
            : [],
        createdAt: DateTime.tryParse(json["createdAt"] ?? '') ?? DateTime.now(),
        updatedAt: DateTime.tryParse(json["updatedAt"] ?? '') ?? DateTime.now(),
        v: json["__v"] ?? 0,
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

  Review copyWith({
    String? id,
    String? user,
    int? rating,
    String? reviewText,
    List<dynamic>? comments,
    DateTime? createdAt,
    DateTime? updatedAt,
    int? v,
  }) {
    return Review(
      id: id ?? this.id,
      user: user ?? this.user,
      rating: rating ?? this.rating,
      reviewText: reviewText ?? this.reviewText,
      comments: comments ?? this.comments,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      v: v ?? this.v,
    );
  }
}
