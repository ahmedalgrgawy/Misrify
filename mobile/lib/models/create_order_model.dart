class CreateOrderModel {
  final List<OrderItem>? orderItems;
  final String shippingAddress;
  final String? shippingMethod;
  final String? coupon;

  CreateOrderModel({
    this.orderItems,
    required this.shippingAddress,
    this.shippingMethod,
    this.coupon,
  });
}

class OrderItem {
  final String product;
  final int quantity;
  final String? color;
  final String? size;

  OrderItem({
    required this.product,
    required this.quantity,
    this.color,
    this.size,
  });
}
