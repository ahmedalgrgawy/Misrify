import 'package:flutter/material.dart';
import 'package:graduation_project1/common/app_style.dart';
import 'package:graduation_project1/constants/constants.dart';
import 'package:graduation_project1/constants/uidata.dart';

class HelpAndSupportTile extends StatelessWidget {
  const HelpAndSupportTile({
    super.key,
    required this.item,
  });

  final FAQItem item;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Icon(
          item.icon,
          color: kNavy, // main-blue equivalent
          size: 48,
        ),
        const SizedBox(height: 16),
        Text(
          item.title,
          style: appStyle(
            20,
            kNavy,
            FontWeight.w600,
          ),
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 8),
        Expanded(
          child: Text(
            item.description,
            style: const TextStyle(
              fontSize: 14,
              color: kGray, // dark-grey equivalent
            ),
            textAlign: TextAlign.center,
          ),
        ),
      ],
    );
  }
}
