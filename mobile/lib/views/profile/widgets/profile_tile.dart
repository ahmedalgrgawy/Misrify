import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:graduation_project1/common/app_style.dart';
import 'package:graduation_project1/common/reusable_text.dart';
import 'package:graduation_project1/constants/constants.dart';

class ProfileTile extends StatelessWidget {
  final IconData icon;
  final String title;
  final VoidCallback onTap;
  final Color? iconColor;
  final Color? textColor;
  final bool showDivider;

  const ProfileTile({
    super.key,
    required this.icon,
    required this.title,
    required this.onTap,
    this.iconColor = kLightGray,
    this.textColor,
    this.showDivider = true,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 15.0),
      child: Column(
        children: [
          ListTile(
            leading: Icon(
              icon,
              color: iconColor ?? kDarkBlue,
              size: 25,
            ),
            title: ReusableText(
              text: title,
              style: appStyle(16, textColor ?? kDarkBlue, FontWeight.w500),
            ),
            trailing: Icon(
              CupertinoIcons.right_chevron,
              color: textColor ?? kGray.withOpacity(0.3),
              size: 20,
            ),
            onTap: onTap,
          ),
          if (showDivider) const Divider(thickness: 1),
        ],
      ),
    );
  }
}
