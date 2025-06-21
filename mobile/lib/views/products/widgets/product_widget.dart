// ignore_for_file: must_be_immutable

import 'dart:convert';

import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:get/get.dart';
import 'package:graduation_project1/common/app_style.dart';
import 'package:graduation_project1/common/reusable_text.dart';
import 'package:graduation_project1/constants/constants.dart';
import 'package:graduation_project1/controllers/wishlist_controller.dart';

class ProductWidget extends StatelessWidget {
  ProductWidget({
    super.key,
    this.image,
    required this.brand,
    required this.price,
    this.discountAmount = 0,
    this.isDiscounted = false,
    this.onTap,
    required this.title,
    required this.id,
  });

  final String? image;
  final String title;
  final String brand;
  final String price;
  final int discountAmount;
  final bool isDiscounted;
  final String id;
  void Function()? onTap;

  @override
  Widget build(BuildContext context) {
    final controller = Get.put(WishlistController());
    final originalPrice = double.tryParse(price) ?? 0.0;
    final discountedPrice =
        (originalPrice - discountAmount).clamp(0, originalPrice);

    return GestureDetector(
      onTap: onTap,
      child: Padding(
        padding: EdgeInsets.only(left: 10.w, right: 5.w),
        child: Container(
          height: 260.h,
          padding: EdgeInsets.symmetric(vertical: 2.w),
          decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(8.r),
              color: Colors.white,
              border: Border.all(color: kLightWhite, width: 0.7)),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Product Image
              Padding(
                padding: EdgeInsets.all(8.w),
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(10.r),
                  child: SizedBox(
                    height: 115.h,
                    width: 140.w,
                    child: () {
                      if (image != null && image!.startsWith('data:image')) {
                        try {
                          final base64Str = image!.split(',').last;
                          return Image.memory(
                            base64Decode(base64Str),
                            fit: BoxFit.fitWidth,
                            errorBuilder: (context, error, stackTrace) {
                              return const Icon(Icons.broken_image, size: 50);
                            },
                          );
                        } catch (_) {
                          return const Icon(Icons.broken_image, size: 50);
                        }
                      } else if (image != null && image!.startsWith('http')) {
                        return Image.network(
                          image!,
                          fit: BoxFit.fitWidth,
                          errorBuilder: (context, error, stackTrace) {
                            return const Icon(Icons.broken_image, size: 50);
                          },
                        );
                      } else {
                        return Image.network(
                          "https://plus.unsplash.com/premium_photo-1664472724753-0a4700e4137b?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                          fit: BoxFit.fitWidth,
                          errorBuilder: (context, error, stackTrace) {
                            return const Icon(Icons.broken_image, size: 50);
                          },
                        );
                      }
                    }(),
                  ),
                ),
              ),

              // Title + Wishlist icon
              Padding(
                padding: EdgeInsets.symmetric(horizontal: 12.w, vertical: 2.h),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Expanded(
                      child: ReusableText(
                        text: title,
                        maxlines: 2,
                        SoftWrap: true,
                        style: appStyle(14, KTextColor, FontWeight.w700),
                      ),
                    ),
                    Obx(() {
                      final isInWishlist = controller.isInWishlist(id);
                      return InkWell(
                        onTap: () {
                          controller.addAndRemoveWishList(id);
                        },
                        child: Padding(
                          padding: EdgeInsets.only(left: 6.w),
                          child: Icon(
                            isInWishlist
                                ? CupertinoIcons.heart_fill
                                : CupertinoIcons.heart,
                            color: kDarkBlue,
                            size: 20,
                          ),
                        ),
                      );
                    }),
                  ],
                ),
              ),

              // Brand
              Padding(
                padding: EdgeInsets.symmetric(horizontal: 12.w),
                child: ReusableText(
                  text: brand,
                  style: appStyle(10, kGray, FontWeight.w400),
                ),
              ),

              const Spacer(),

              // Price
              Padding(
                padding: EdgeInsets.symmetric(horizontal: 12.w),
                child: isDiscounted && discountAmount > 0
                    ? Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          ReusableText(
                            text: "EGP ${discountedPrice.toStringAsFixed(2)}",
                            style: appStyle(14, kDarkBlue, FontWeight.bold),
                          ),
                          ReusableText(
                            text: "EGP $price",
                            style:
                                appStyle(12, kGray, FontWeight.w400).copyWith(
                              decoration: TextDecoration.lineThrough,
                            ),
                          ),
                        ],
                      )
                    : ReusableText(
                        text: "EGP $price",
                        style: appStyle(13, KTextColor, FontWeight.w700),
                      ),
              ),
              SizedBox(height: 6.h),
            ],
          ),
        ),
      ),
    );
  }
}
