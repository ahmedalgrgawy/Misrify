import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:graduation_project1/common/app_style.dart';
import 'package:graduation_project1/common/custom_button.dart';
import 'package:graduation_project1/common/reusable_text.dart';
import 'package:graduation_project1/constants/constants.dart';
import 'package:graduation_project1/controllers/order_controller.dart';
import 'package:graduation_project1/models/all_orders_model.dart';
import 'package:graduation_project1/views/orders/widgets/order_details_items.dart';

class OrderDetailsScreen extends StatelessWidget {
  final Order order;

  const OrderDetailsScreen({super.key, required this.order});

  @override
  Widget build(BuildContext context) {
    final controller = Get.put(OrderController());

    final shortOrderId =
        order.id.length >= 6 ? order.id.substring(0, 6) : order.id;
    String statusText;
    switch (order.status) {
      case 'pending':
      case 'unpaid':
        statusText = 'Pending';
        break;
      case 'paid':
        statusText = 'Order In Progress';
        break;
      case 'shipped':
      case 'delivered':
        statusText = 'Order Delivered';
        break;
      case 'cancelled':
        statusText = 'Order Cancelled';
        break;
      default:
        statusText = 'Unknown Status';
    }
    Color statusColor;
    switch (order.status) {
      case 'pending':
      case 'unpaid':
        statusColor = kLightGray;
        break;
      case 'paid':
        statusColor = Colors.orange.withOpacity(0.5);
        break;
      case 'shipped':
      case 'delivered':
        statusColor = Colors.green.withOpacity(0.5);
        break;
      case 'cancelled':
        statusColor = Colors.red.withOpacity(0.5);
        break;
      default:
        statusColor = kLightGray;
    }

    return Scaffold(
      appBar: AppBar(
        backgroundColor: Kbackground,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: KTextColor),
          onPressed: () => Get.back(),
        ),
        title: ReusableText(
          text: 'Order Details',
          style: appStyle(20, KTextColor, FontWeight.w600),
        ),
        centerTitle: true,
      ),
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Order ID
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
            child: ReusableText(
              text: "Order ID: $shortOrderId",
              style: appStyle(16, KTextColor, FontWeight.w600),
            ),
          ),

          // Order Container with Status + Items
          Expanded(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
              child: Container(
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: kLightWhite),
                ),
                child: Column(
                  children: [
                    // Status Bar
                    Container(
                      width: double.infinity,
                      decoration: BoxDecoration(
                        color: statusColor,
                        borderRadius: const BorderRadius.vertical(
                          top: Radius.circular(20),
                        ),
                      ),
                      padding: const EdgeInsets.symmetric(
                          vertical: 16, horizontal: 16),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          ReusableText(
                            text: statusText,
                            style: appStyle(18, KNavyBlack, FontWeight.w600),
                          ),
                          ReusableText(
                            text:
                                '${order.createdAt.day}/${order.createdAt.month}/${order.createdAt.year}',
                            style: appStyle(16, KTextColor, FontWeight.w500),
                          ),
                        ],
                      ),
                    ),

                    // Items List
                    Expanded(
                      child: ListView.builder(
                        padding: const EdgeInsets.all(16),
                        itemCount: order.orderItems.length,
                        itemBuilder: (context, index) {
                          final item = order.orderItems[index];

                          if (item.product.id.isEmpty) {
                            return Container(
                              margin: const EdgeInsets.only(bottom: 16),
                              padding: const EdgeInsets.all(16),
                              decoration: BoxDecoration(
                                color: Colors.white,
                                borderRadius: BorderRadius.circular(12),
                                border: Border.all(color: Colors.grey.shade300),
                              ),
                              child: Text(
                                "Product for this order item is not available anymore.",
                                style: appStyle(
                                    14, Colors.red.shade400, FontWeight.w500),
                              ),
                            );
                          }

                          return Padding(
                            padding: const EdgeInsets.only(bottom: 16),
                            child: OrderDetailsItems(item: item),
                          );
                        },
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),

          // Cancel Button if eligible
          if (order.status == 'pending')
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
              child: CustomButton(
                  text: 'Cancel Order',
                  textcolor: Colors.white,
                  btnHeight: 60,
                  btnColor: kRed,
                  borderColor: kRed,
                  onTap: () async {
                    final confirm = await showDialog<bool>(
                      context: context,
                      builder: (ctx) => AlertDialog(
                        title: const Text('Cancel Order?'),
                        content: const Text(
                            'Are you sure you want to cancel this order?'),
                        actions: [
                          TextButton(
                            onPressed: () => Navigator.of(ctx).pop(false),
                            child: const Text('No'),
                          ),
                          TextButton(
                            onPressed: () => Navigator.of(ctx).pop(true),
                            child: const Text('Yes'),
                          ),
                        ],
                      ),
                    );

                    if (confirm == true) {
                      final success = await controller.cancelOrder(order.id);
                      if (success) {
                        Get.back(); // pop OrderDetailsScreen
                        Get.snackbar(
                            'Cancelled', 'Order cancelled successfully.',
                            backgroundColor: Colors.green,
                            colorText: Colors.white);
                        await Future.delayed(const Duration(milliseconds: 300));
                        Get.back(); // pop to AllOrdersScreen
                      }
                    }
                  }),
            ),
        ],
      ),
    );
  }
}
