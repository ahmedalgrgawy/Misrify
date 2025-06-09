import 'dart:convert';
import 'package:graduation_project1/models/products_model.dart'; // ✅ Use Brand from here

WishlistResponse wishlistResponseFromJson(String str) =>
    WishlistResponse.fromJson(json.decode(str));

String wishlistResponseToJson(WishlistResponse data) =>
    json.encode(data.toJson());

class WishlistResponse {
  final bool success;
  final Wishlist wishlist;

  WishlistResponse({
    required this.success,
    required this.wishlist,
  });

  factory WishlistResponse.fromJson(Map<String, dynamic> json) =>
      WishlistResponse(
        success: json["success"],
        wishlist: Wishlist.fromJson(json["wishlist"]),
      );

  Map<String, dynamic> toJson() => {
        "success": success,
        "wishlist": wishlist.toJson(),
      };
}

class Wishlist {
  final String id;
  final String user;
  final List<WishlistItem> wishlistItems;
  final DateTime createdAt;
  final DateTime updatedAt;
  final int v;

  Wishlist({
    required this.id,
    required this.user,
    required this.wishlistItems,
    required this.createdAt,
    required this.updatedAt,
    required this.v,
  });

  factory Wishlist.fromJson(Map<String, dynamic> json) => Wishlist(
        id: json["_id"],
        user: json["user"],
        wishlistItems: List<WishlistItem>.from(
          json["wishlistItems"].map((x) => WishlistItem.fromJson(x)),
        ),
        createdAt: DateTime.parse(json["createdAt"]),
        updatedAt: DateTime.parse(json["updatedAt"]),
        v: json["__v"],
      );

  Map<String, dynamic> toJson() => {
        "_id": id,
        "user": user,
        "wishlistItems":
            List<dynamic>.from(wishlistItems.map((x) => x.toJson())),
        "createdAt": createdAt.toIso8601String(),
        "updatedAt": updatedAt.toIso8601String(),
        "__v": v,
      };
}

class WishlistItem {
  final String id;
  final String name;
  final String category;
  final Brand brand;
  final String? imgUrl;
// ✅ From products_model.dart
  final String description;
  final int quantityInStock;
  final double price;
  final List<String> colors;
  final List<String> sizes;
  final bool isDiscounted;
  final int discountAmount;
  final bool isApproved;
  final List<dynamic> reviews;
  final DateTime createdAt;
  final DateTime updatedAt;
  final int v;

  WishlistItem({
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
    this.imgUrl,
  });

  factory WishlistItem.fromJson(Map<String, dynamic> json) => WishlistItem(
        id: json["_id"],
        name: json["name"],
        imgUrl: json["imgUrl"],

        category: json["category"],
        brand: json["brand"] is Map<String, dynamic>
            ? Brand.fromJson(json["brand"])
            : Brand.empty(), // fallback
        description: json["description"],
        quantityInStock: json["quantityInStock"],
        price: (json["price"] ?? 0).toDouble(),
        colors: List<String>.from(json["colors"].map((x) => x)),
        sizes: List<String>.from(json["sizes"].map((x) => x)),
        isDiscounted: json["isDiscounted"],
        discountAmount: json["discountAmount"],
        isApproved: json["isApproved"],
        reviews: List<dynamic>.from(json["reviews"].map((x) => x)),
        createdAt: DateTime.parse(json["createdAt"]),
        updatedAt: DateTime.parse(json["updatedAt"]),
        v: json["__v"],
      );

  Map<String, dynamic> toJson() => {
        "_id": id,
        "imgUrl": imgUrl,
        "name": name,
        "category": category,
        "brand": brand.toJson(),
        "description": description,
        "quantityInStock": quantityInStock,
        "price": price,
        "colors": List<dynamic>.from(colors.map((x) => x)),
        "sizes": List<dynamic>.from(sizes.map((x) => x)),
        "isDiscounted": isDiscounted,
        "discountAmount": discountAmount,
        "isApproved": isApproved,
        "reviews": List<dynamic>.from(reviews.map((x) => x)),
        "createdAt": createdAt.toIso8601String(),
        "updatedAt": updatedAt.toIso8601String(),
        "__v": v,
      };

  /// ✅ Convert to Product model for detail screen
  Product toProduct() {
    return Product(
      id: id,
      name: name,
      category: Brand(
        id: category, // ✅ this is the actual category ID coming from backend
        name: '', // You can leave name empty or fetch it separately if needed
        owner: '',
        description: '',
        createdAt: DateTime.now(),
        updatedAt: DateTime.now(),
        v: 0,
      ),
      brand: Brand(
        id: brand.id,
        name: brand.name,
        owner: brand.owner,
        description: brand.description,
        createdAt: brand.createdAt,
        updatedAt: brand.updatedAt,
        v: brand.v,
      ),
      description: description,
      quantityInStock: quantityInStock,
      price: price,
      colors: colors,
      sizes: sizes,
      isDiscounted: isDiscounted,
      discountAmount: discountAmount,
      isApproved: isApproved,
      reviews: [],
      createdAt: createdAt,
      updatedAt: updatedAt,
      v: v,
    );
  }
}
