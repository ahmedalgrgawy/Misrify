import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:graduation_project1/common/app_style.dart';
import 'package:graduation_project1/common/reusable_text.dart';
import 'package:graduation_project1/constants/constants.dart';
import 'package:graduation_project1/models/all_orders_model.dart';

class OrderDetailsItems extends StatelessWidget {
  final OrderItem item;

  const OrderDetailsItems({super.key, required this.item});

  @override
  Widget build(BuildContext context) {
    final product = item.product;

    return Container(
      margin: EdgeInsets.symmetric(vertical: 10.h),
      padding: EdgeInsets.all(10.r),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16.r),
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withOpacity(0.08),
            blurRadius: 10,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      child: IntrinsicHeight(
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            ClipRRect(
              borderRadius: BorderRadius.circular(12.r),
              child: SizedBox(
                width: 80.w,
                height: 80.h,
                child: Builder(builder: (_) {
                  if (product.imgUrl != null &&
                      product.imgUrl!.startsWith('data:image')) {
                    try {
                      final base64Str = product.imgUrl!.split(',').last;
                      return Image.memory(
                        base64Decode(base64Str),
                        fit: BoxFit.cover,
                      );
                    } catch (_) {
                      return const Icon(Icons.broken_image, size: 50);
                    }
                  } else if (product.imgUrl != null) {
                    return Image.network(
                      product.imgUrl!,
                      fit: BoxFit.cover,
                      errorBuilder: (_, __, ___) =>
                          const Icon(Icons.broken_image, size: 50),
                    );
                  } else {
                    return Image.asset("assets/images/placeholder.png",
                        fit: BoxFit.cover);
                  }
                }),
              ),
            ),
            SizedBox(width: 12.w),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  ReusableText(
                    text: product.name,
                    style: appStyle(14, Kfoundation, FontWeight.w600),
                    maxlines: 1,
                  ),
                  SizedBox(height: 6.h),
                  Row(
                    children: [
                      if (item.color.toLowerCase() != 'default')
                        _buildTag("Color: ${item.color}"),
                      if (item.size.toLowerCase() != 'default') ...[
                        SizedBox(width: 6.w),
                        _buildTag("Size: ${item.size}"),
                      ],
                      SizedBox(width: 6.w),
                      _buildTag("Qty: ${item.quantity}"),
                    ],
                  ),
                  SizedBox(height: 10.h),
                  ReusableText(
                    text: "EGP ${item.price.toStringAsFixed(2)}",
                    style: appStyle(14, kDarkBlue, FontWeight.w600),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTag(String label) {
    return Container(
      padding: EdgeInsets.symmetric(horizontal: 6.w, vertical: 2.h),
      decoration: BoxDecoration(
        color: Colors.grey.shade100,
        borderRadius: BorderRadius.circular(4.r),
      ),
      child: ReusableText(
        text: label,
        style: appStyle(12, Kfoundation, FontWeight.w400),
      ),
    );
  }
}
