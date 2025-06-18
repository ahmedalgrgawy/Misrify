class PaymentResponseModel {
  final bool success;
  final String message;
  final Data? data; // make nullable to avoid crash on failed response

  PaymentResponseModel({
    required this.success,
    required this.message,
    this.data,
  });

  factory PaymentResponseModel.fromJson(Map<String, dynamic> json) {
    return PaymentResponseModel(
      success: json['success'] ?? false,
      message: json['message'] ?? '',
      data: json['data'] != null ? Data.fromJson(json['data']) : null,
    );
  }
}

class Data {
  final String paymentId;
  final String iframeUrl;
  final String orderId;
  final String trackCode;

  Data({
    required this.paymentId,
    required this.iframeUrl,
    required this.orderId,
    required this.trackCode,
  });

  factory Data.fromJson(Map<String, dynamic> json) {
    return Data(
      paymentId: json['paymentId'] ?? '',
      iframeUrl: json['iframeUrl'] ?? '',
      orderId: json['orderId'] ?? '',
      trackCode: json['trackCode'] ?? '',
    );
  }
}
