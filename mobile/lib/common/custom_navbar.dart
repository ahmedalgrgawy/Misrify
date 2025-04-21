// ignore_for_file: library_private_types_in_public_api

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
    _NavItemData("assets/icons/home-2.png", "Home"),
    _NavItemData("assets/icons/search.png", "Search"),
    _NavItemData("assets/icons/Heart.png", "Wishlist"),
    _NavItemData("assets/icons/Frame.png", "Shop"),
    _NavItemData("assets/icons/user.png", "Profile"),
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

                return GestureDetector(
                  onTap: () => onTap(iconIndex),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      if (!isCenter)
                        Image.asset(
                          items[iconIndex].icon,
                          height: 24.h,
                        )
                      else
                        const SizedBox(height: 24),
                      const SizedBox(height: 4),
                      if (!isCenter)
                        ReusableText(
                          text: items[iconIndex].label,
                          style: appStyle(12, Knavbarlabels, FontWeight.w400),
                        ),
                      if (isCenter)
                        ReusableText(
                          text: items[iconIndex].label,
                          style: appStyle(12, kNavy, FontWeight.w400),
                        ),
                    ],
                  ),
                );
              }),
            ),
          ),
        ),

        // Elevated center button
        Positioned(
          bottom: 27,
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
                    color: kNavy,
                    blurRadius: 12,
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
                  child: Image.asset(
                    items[currentIndex].icon,
                    key: ValueKey<int>(currentIndex),
                    color: currentIndex != 0 ? Colors.white : null,
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
  final String icon;
  final String label;
  const _NavItemData(this.icon, this.label);
}
