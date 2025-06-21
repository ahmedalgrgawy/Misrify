import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:intl/intl.dart';
import 'package:graduation_project1/views/orders/order_details_screen.dart';
import 'package:graduation_project1/common/app_style.dart';
import 'package:graduation_project1/common/reusable_text.dart';
import 'package:graduation_project1/constants/constants.dart';
import 'package:graduation_project1/models/all_orders_model.dart';

class OrderTile extends StatelessWidget {
  const OrderTile({super.key, required this.order});
  final Order order;

  Widget _buildStatusChip(String status) {
    Color color;
    String text;

    switch (status) {
      case 'paid':
        color = Colors.orange;
        text = 'In Progress';
        break;
      case 'shipped':
      case 'delivered':
        color = Colors.green;
        text = 'Delivered';
        break;
      case 'cancelled':
        color = Colors.red;
        text = 'Cancelled';
        break;
      default:
        color = kGray;
        text = 'Pending';
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(9),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 8,
            height: 8,
            margin: const EdgeInsets.only(right: 6),
            decoration: BoxDecoration(
              color: color,
              shape: BoxShape.circle,
            ),
          ),
          Text(
            text,
            style: TextStyle(
              color: color,
              fontSize: 14,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final formattedDate = DateFormat('MMMM d, y').format(order.createdAt);
    final shortOrderId =
        order.id.length >= 6 ? order.id.substring(0, 6) : order.id;

    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: kLightWhite),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Order ID + Status
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              ReusableText(
                text: "Order ID: $shortOrderId",
                style: appStyle(16, KTextColor, FontWeight.w600),
              ),
              _buildStatusChip(order.status),
            ],
          ),
          const SizedBox(height: 8),
          ReusableText(
            text: "Placed on: $formattedDate",
            style: appStyle(13, kLightGray, FontWeight.w400),
          ),
          const SizedBox(height: 16),
          // Total + Button
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  ReusableText(
                    text: 'Total amount',
                    style: appStyle(14, kGray, FontWeight.w400),
                  ),
                  ReusableText(
                    text: 'EGP ${order.totalPrice.toStringAsFixed(2)}',
                    style: appStyle(16, KTextColor, FontWeight.w600),
                  ),
                ],
              ),
              ElevatedButton(
                onPressed: () {
                  Get.to(() => OrderDetailsScreen(order: order));
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.white,
                  foregroundColor: KblueOcean,
                  side: const BorderSide(color: kLightWhite),
                  elevation: 1,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                ),
                child: const Text('View Details'),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
