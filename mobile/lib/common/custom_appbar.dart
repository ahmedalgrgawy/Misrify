import 'package:flutter/material.dart';
import 'package:graduation_project1/common/app_style.dart';
import 'package:graduation_project1/common/reusable_text.dart';
import 'package:graduation_project1/constants/constants.dart';

class CustomAppbar extends StatelessWidget implements PreferredSizeWidget {
  final String title;
  final void Function()? onpress;

  const CustomAppbar({super.key, required this.title, this.onpress});

  @override
  Widget build(BuildContext context) {
    return AppBar(
      backgroundColor: Kbackground,
      centerTitle: true,
      leading: IconButton(
        icon: const Icon(Icons.arrow_back, color: KTextColor),
        onPressed: onpress,
      ),
      title: ReusableText(
        text: title,
        style: appStyle(18, KTextColor, FontWeight.w600),
      ),
    );
  }

  @override
  Size get preferredSize => const Size.fromHeight(kToolbarHeight);
}
