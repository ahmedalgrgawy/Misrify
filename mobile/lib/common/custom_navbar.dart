// ignore_for_file: library_private_types_in_public_api

import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:graduation_project1/common/app_style.dart';
import 'package:graduation_project1/common/painter.dart';
import 'package:graduation_project1/common/reusable_text.dart';
import 'package:graduation_project1/constants/constants.dart';

class CustomNavBar extends StatelessWidget {
  final int currentIndex;
  final Function(int) onTap;

  const CustomNavBar({
    super.key,
    required this.currentIndex,
    required this.onTap,
  });

  final List<_NavItemData> items = const [
    _NavItemData(CupertinoIcons.home, "Home"),
    _NavItemData(CupertinoIcons.search, "Search"),
    _NavItemData(CupertinoIcons.heart, "Wishlist"),
    _NavItemData(Icons.storefront_outlined, "Shop"),
    _NavItemData(Icons.shopping_cart_outlined, "Cart"),
  ];

  @override
  Widget build(BuildContext context) {
    const double buttonSize = 60;

    return Stack(
      alignment: Alignment.bottomCenter,
      clipBehavior: Clip.none,
      children: [
        CustomPaint(
          size: Size(MediaQuery.of(context).size.width, 65),
          painter: NavBarNotchPainter(),
          child: Padding(
            padding: EdgeInsets.only(top: 10.h, left: 8.w, right: 8.w),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: List.generate(items.length, (index) {
                final iconIndex = index == 2
                    ? currentIndex
                    : (index == currentIndex ? 2 : index);
                final isCenter = index == 2;

                // Add Spacer around center index to ensure equal spacing
                if (index == 2) {
                  return Expanded(
                    child: const SizedBox(), // reserve space for center button
                  );
                }

                return Expanded(
                  child: GestureDetector(
                    onTap: () => onTap(iconIndex),
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          items[iconIndex].icon,
                          size: 24.h,
                          color: kNavy,
                        ),
                        const SizedBox(height: 4),
                        ReusableText(
                          text: items[iconIndex].label,
                          style: appStyle(12, Knavbarlabels, FontWeight.w400),
                        ),
                      ],
                    ),
                  ),
                );
              }),
            ),
          ),
        ),

        // Elevated center button
        Positioned(
          bottom: 20,
          child: GestureDetector(
            onTap: () => onTap(currentIndex),
            child: Container(
              height: buttonSize,
              width: buttonSize,
              decoration: const BoxDecoration(
                color: kNavy,
                shape: BoxShape.circle,
                boxShadow: [
                  BoxShadow(
                    color: kLightBlue,
                    blurRadius: 10,
                    offset: Offset(0, 4),
                  )
                ],
              ),
              child: Center(
                child: AnimatedSwitcher(
                  duration: const Duration(milliseconds: 350),
                  transitionBuilder: (child, animation) {
                    return ScaleTransition(
                      scale: animation,
                      child: FadeTransition(
                        opacity: animation,
                        child: child,
                      ),
                    );
                  },
                  child: Icon(
                    items[currentIndex].icon,
                    key: ValueKey<int>(currentIndex),
                    size: 28.h,
                    color: Colors.white,
                  ),
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }
}

class _NavItemData {
  final IconData icon;
  final String label;
  const _NavItemData(this.icon, this.label);
}
