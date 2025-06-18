import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:graduation_project1/controllers/order_controller.dart';
import 'package:graduation_project1/views/orders/allOrders_screen.dart';
import 'package:webview_flutter/webview_flutter.dart';
import 'package:graduation_project1/controllers/cart_controller.dart';

class PaymentWebViewScreen extends StatelessWidget {
  final String iframeUrl;
  const PaymentWebViewScreen({super.key, required this.iframeUrl});

  @override
  Widget build(BuildContext context) {
    final cartController = Get.find<CartController>();
    final orderController = Get.put(OrderController());

    late final WebViewController controller;

    controller = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..setNavigationDelegate(
        NavigationDelegate(onPageFinished: (url) async {
          if (_isSuccessUrl(url)) {
            final uri = Uri.parse(url);
            final id = uri.queryParameters['id'];
            final order = uri.queryParameters['order'];
            final amount = uri.queryParameters['amount_cents'];

            debugPrint("✅ Detected successful payment");

            // 🟢 Call the callback endpoint
            if (id != null && order != null && amount != null) {
              await orderController.postPaymentCallback(
                id: id,
                order: order,
                amountCents: int.tryParse(amount) ?? 0,
              );
            }

            await cartController.clearCart();
            await cartController.refreshCartCount();
            Get.offAll(() => const AllOrdersScreen());
          }
        }),
      )
      ..loadRequest(Uri.parse(iframeUrl));

    return Scaffold(
      appBar: AppBar(title: const Text("Secure Payment")),
      body: WebViewWidget(controller: controller),
    );
  }

  bool _isSuccessUrl(String url) {
    return url.contains("payment-success") ||
        url.contains("txn_response_code=APPROVED");
  }
}
