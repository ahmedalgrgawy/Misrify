import 'package:flutter/material.dart';
import 'package:graduation_project1/common/app_style.dart';
import 'package:graduation_project1/common/reusable_text.dart';
import 'package:graduation_project1/constants/constants.dart';

class DeliverySection extends StatelessWidget {
  const DeliverySection({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(4),
      ),
      child: Column(
        children: [
          Row(
            children: [
              const Icon(Icons.local_shipping, size: 24, color: kDarkBlue),
              const SizedBox(width: 8),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    ReusableText(
                      text: 'Free Delivery',
                      style: appStyle(14, kDarkBlue, FontWeight.w500),
                    ),
                    ReusableText(
                      text: 'Enter your postal code for Delivery Availability',
                      style: appStyle(10, kGray, FontWeight.w500),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const Padding(
            padding: EdgeInsets.symmetric(vertical: 8),
            child: Divider(color: kLightGray, thickness: 1),
          ),
          Row(
            children: [
              const Icon(Icons.refresh, size: 24, color: Colors.black),
              const SizedBox(width: 12),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  ReusableText(
                    text: 'Return Delivery',
                    style: appStyle(14, kDarkBlue, FontWeight.w500),
                  ),
                  ReusableText(
                    text: 'Free 30 Days Delivery Returns. Details',
                    style: appStyle(10, kGray, FontWeight.w500),
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
    );
  }
}
