import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:graduation_project1/common/app_style.dart';
import 'package:graduation_project1/common/reusable_text.dart';
import 'package:graduation_project1/constants/constants.dart';

class CouponTile extends StatelessWidget {
  const CouponTile({
    super.key,
    required this.descount,
    required this.code,
    required this.expirDate,
  });

  final double descount;
  final String expirDate;
  final String code;

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.symmetric(vertical: 8),
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 15),
      decoration: BoxDecoration(
        color: Colors.white,
        border: Border.all(color: kLightWhite),
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: kLightGray.withOpacity(0.2),
            blurRadius: 8,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Coupon code row
          Row(
            children: [
              Expanded(
                child: ReusableText(
                  text:
                      '${code.substring(0, 8)}...${code.substring(code.length - 4)}',
                  style: appStyle(14, KTextColor, FontWeight.w600),
                ),
              ),
              InkWell(
                onTap: () {
                  Clipboard.setData(ClipboardData(text: code));
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Code copied to clipboard')),
                  );
                },
                child: const Icon(Icons.copy, size: 20, color: kGray),
              ),
            ],
          ),
          const SizedBox(height: 6),
          // Discount
          ReusableText(
            text: 'Discount: ${descount.toStringAsFixed(0)}%',
            style: appStyle(14, kGray, FontWeight.w500),
          ),
          const SizedBox(height: 6),
          // Expiration
          ReusableText(
            text:
                'Expires on: ${DateTime.parse(expirDate).toLocal().toString().split(' ')[0].split('-').reversed.join('-')}',
            style: appStyle(14, kGray, FontWeight.w400),
          ),
        ],
      ),
    );
  }
}
