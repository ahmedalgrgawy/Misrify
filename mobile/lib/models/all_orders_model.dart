class AllOrderModel {
  final String message;
  final List<Order> orders;

  AllOrderModel({
    required this.message,
    required this.orders,
  });

  factory AllOrderModel.fromJson(Map<String, dynamic> json) {
    return AllOrderModel(
      message: json['message'],
      orders: List<Order>.from(
        json['orders'].map((item) => Order.fromJson(item)),
      ),
    );
  }
}

class Order {
  final String id;
  final String user;
  final String? coupon;
  final List<OrderItem> orderItems;
  final String shippingAddress;
  final String shippingMethod;
  final String trackCode;
  final String status;
  final double totalPrice;
  final DateTime createdAt;
  final DateTime updatedAt;
  final int v;

  Order({
    required this.id,
    required this.user,
    this.coupon,
    required this.orderItems,
    required this.shippingAddress,
    required this.shippingMethod,
    required this.trackCode,
    required this.status,
    required this.totalPrice,
    required this.createdAt,
    required this.updatedAt,
    required this.v,
  });

  factory Order.fromJson(Map<String, dynamic> json) {
    return Order(
      id: json['_id'],
      user: json['user'],
      coupon: json['coupon'],
      orderItems: List<OrderItem>.from(
        json['orderItems'].map((item) => OrderItem.fromJson(item)),
      ),
      shippingAddress: json['shippingAddress'],
      shippingMethod: json['shippingMethod'],
      trackCode: json['trackCode'],
      status: json['status'],
      totalPrice: (json['totalPrice'] as num).toDouble(),
      createdAt: DateTime.parse(json['createdAt']),
      updatedAt: DateTime.parse(json['updatedAt']),
      v: json['__v'],
    );
  }
}

class OrderItem {
  final String id;
  final Product product;
  final int quantity;
  final String color;
  final String size;
  final double price;
  final int v;

  OrderItem({
    required this.id,
    required this.product,
    required this.quantity,
    required this.color,
    required this.size,
    required this.price,
    required this.v,
  });

  factory OrderItem.fromJson(Map<String, dynamic> json) {
    final productJson = json['product'];
    final product = (productJson is Map<String, dynamic>)
        ? Product.fromJson(productJson)
        : Product.deleted();

    return OrderItem(
      id: json['_id'],
      product: product,
      quantity: json['quantity'],
      color: json['color'],
      size: json['size'],
      price: (json['price'] as num).toDouble(),
      v: json['__v'],
    );
  }
}

class Product {
  final String id;
  final String name;
  final String? imgUrl;

  Product({
    required this.id,
    required this.name,
    this.imgUrl,
  });

  factory Product.fromJson(Map<String, dynamic> json) {
    return Product(
      id: json['_id'],
      name: json['name'],
      imgUrl: json['imgUrl'],
    );
  }

  factory Product.deleted() {
    return Product(
      id: '',
      name: '[Deleted Product]',
      imgUrl: null,
    );
  }
}
