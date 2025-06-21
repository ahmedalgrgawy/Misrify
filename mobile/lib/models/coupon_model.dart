// models/coupon_model.dart

class Coupon {
  final String id;
  final String user;
  final String code;
  final int discount;
  final DateTime expirationDate;
  final bool isActive;
  final int usedPoints;
  final DateTime createdAt;
  final DateTime updatedAt;
  final int v;

  Coupon({
    required this.id,
    required this.user,
    required this.code,
    required this.discount,
    required this.expirationDate,
    required this.isActive,
    required this.usedPoints,
    required this.createdAt,
    required this.updatedAt,
    required this.v,
  });

  factory Coupon.fromJson(Map<String, dynamic> json) {
    return Coupon(
      id: json['_id'],
      user: json['user'],
      code: json['code'],
      discount: json['discount'],
      expirationDate: DateTime.parse(json['expirationDate']),
      isActive: json['isActive'],
      usedPoints: json['usedPoints'],
      createdAt: DateTime.parse(json['createdAt']),
      updatedAt: DateTime.parse(json['updatedAt']),
      v: json['__v'],
    );
  }
}

class CouponModel {
  final String message;
  final Coupon coupon;
  final int discount;

  CouponModel({
    required this.message,
    required this.coupon,
    required this.discount,
  });

  factory CouponModel.fromJson(Map<String, dynamic> json) {
    return CouponModel(
      message: json['message'],
      coupon: Coupon.fromJson(json['coupon']),
      discount: json['discount'],
    );
  }
}

class AllCouponsModel {
  final List<Coupon> coupons;

  AllCouponsModel({required this.coupons});

  factory AllCouponsModel.fromJson(Map<String, dynamic> json) {
    return AllCouponsModel(
      coupons: List<Coupon>.from(
        json['coupons'].map((x) => Coupon.fromJson(x)),
      ),
    );
  }
}
