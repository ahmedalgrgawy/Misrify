import 'dart:convert';
import 'package:graduation_project1/models/products_model.dart' as models;

CartResponse cartResponseFromJson(String str) =>
    CartResponse.fromJson(json.decode(str));

String cartResponseToJson(CartResponse data) => json.encode(data.toJson());

class CartResponse {
  final bool success;
  final String message;
  final Cart cart;

  CartResponse({
    required this.success,
    required this.message,
    required this.cart,
  });

  factory CartResponse.fromJson(Map<String, dynamic> json) => CartResponse(
        success: json["success"],
        message: json["message"] ?? '',
        cart: Cart.fromJson(json["cart"]),
      );

  Map<String, dynamic> toJson() => {
        "success": success,
        "message": message,
        "cart": cart.toJson(),
      };
}

class Cart {
  final String id;
  final String user;
  final List<CartItem> cartItems;
  final double totalPrice;
  final DateTime createdAt;
  final DateTime updatedAt;
  final int v;

  Cart({
    required this.id,
    required this.user,
    required this.cartItems,
    required this.totalPrice,
    required this.createdAt,
    required this.updatedAt,
    required this.v,
  });

  factory Cart.fromJson(Map<String, dynamic> json) => Cart(
        id: json["_id"],
        user: json["user"],
        cartItems: List<CartItem>.from(
          json["cartItems"].map((x) => CartItem.fromJson(x)),
        ),
        totalPrice: (json["totalPrice"] ?? 0).toDouble(),
        createdAt: DateTime.parse(json["createdAt"]),
        updatedAt: DateTime.parse(json["updatedAt"]),
        v: json["__v"],
      );

  Map<String, dynamic> toJson() => {
        "_id": id,
        "user": user,
        "cartItems": List<dynamic>.from(cartItems.map((x) => x.toJson())),
        "totalPrice": totalPrice,
        "createdAt": createdAt.toIso8601String(),
        "updatedAt": updatedAt.toIso8601String(),
        "__v": v,
      };
}

class CartItem {
  final String id;
  final models.Product product;
  final int quantity;
  final String color;
  final String size;
  final double price;
  final double total;

  CartItem({
    required this.id,
    required this.product,
    required this.quantity,
    required this.color,
    required this.size,
    required this.price,
    required this.total,
  });

  factory CartItem.fromJson(Map<String, dynamic> json) {
    final productRaw = json["product"];

    final models.Product product = productRaw is Map<String, dynamic>
        ? models.Product.fromJson(productRaw)
        : models.Product(
            id: productRaw?.toString() ?? 'unknown',
            name: "Unknown",
            price: 0.0,
            category: models.Brand.empty(),
            brand: models.Brand.empty(),
            description: "",
            quantityInStock: 0,
            colors: [],
            sizes: [],
            isDiscounted: false,
            discountAmount: 0,
            isApproved: false,
            reviews: [],
            createdAt: DateTime.now(),
            updatedAt: DateTime.now(),
            v: 0,
          );

    return CartItem(
      id: json["_id"] ?? 'unknown',
      product: product,
      quantity: json["quantity"] ?? 0,
      color: json["color"] ?? '',
      size: json["size"] ?? '',
      price: (json["price"] ?? 0).toDouble(),
      total: (json["total"] ?? 0).toDouble(),
    );
  }

  Map<String, dynamic> toJson() => {
        "_id": id,
        "product": product.toJson(),
        "quantity": quantity,
        "color": color,
        "size": size,
        "price": price,
        "total": total,
      };
}
