// ignore_for_file: must_be_immutable

import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:get/get.dart';

import 'package:graduation_project1/common/app_style.dart';
import 'package:graduation_project1/common/reusable_text.dart';
import 'package:graduation_project1/constants/constants.dart';
import 'package:graduation_project1/views/shop/shop_screen.dart';
import 'package:graduation_project1/views/wishlist/wishlist_screen.dart';

class Appbar extends StatelessWidget implements PreferredSizeWidget {
  final String title;
  Widget? Child;
  bool showBackArrow;
  final double? height;
  final EdgeInsetsGeometry? padd;
  Appbar(
      {super.key,
      required this.title,
      this.Child,
      this.padd = const EdgeInsets.all(10),
      this.showBackArrow = false,
      this.height});

  @override
  Widget build(BuildContext context) {
    return Container(
      height: height,
      color: kLightWhite,
      padding: padd,
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          CircleAvatar(
            backgroundColor: Colors.white,
            child: const Icon(Icons.person),
            radius: 15.r,
          ),
          ReusableText(
              text: title, style: appStyle(20, kDarkBlue, FontWeight.w700)),
          Row(
            children: [
              InkWell(
                  onTap: () => Get.to(const WishlistScreen()),
                  child: const Badge(
                    backgroundColor: Colors.amber,
                    label: Text('1'),
                    child: Icon(
                      CupertinoIcons.bell,
                      color: kBlue,
                      size: 25,
                    ),
                  )),
              SizedBox(
                width: 7.w,
              ),
              InkWell(
                  onTap: () => Get.to(const ShopScreen()),
                  child: const Badge(
                    label: Text('1'),
                    child: Icon(
                      Icons.shopping_cart_outlined,
                      color: kBlue,
                      size: 30,
                    ),
                  )),
            ],
          )
        ],
      ),
    );
  }

  @override
  // TODO: implement preferredSize
  Size get preferredSize => const Size.fromHeight(80);
}
