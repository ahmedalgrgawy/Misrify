import 'dart:convert';

import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:get/get.dart';
import 'package:graduation_project1/common/app_style.dart';
import 'package:graduation_project1/common/reusable_text.dart';
import 'package:graduation_project1/constants/constants.dart';
import 'package:graduation_project1/controllers/cart_controller.dart';
import 'package:graduation_project1/controllers/wishlist_controller.dart';
import 'package:graduation_project1/hooks/fetch_all_brands.dart';
import 'package:graduation_project1/models/wishlist_response.dart';

class WishlistTile extends HookWidget {
  WishlistTile({Key? key, required this.wishlist, this.refetch, this.ontap})
      : super(key: key);

  final WishlistItem wishlist;
  final Function()? refetch;
  void Function()? ontap;

  @override
  Widget build(BuildContext context) {
    final wishlistController = Get.find<WishlistController>();
    final cartController = Get.put(CartController());
    final brandsHook = useFetchBrands();
    final allBrands = brandsHook.data ?? [];

    final brandName = wishlist.brand.name;

    final discountedPrice =
        (wishlist.price - wishlist.discountAmount).clamp(0, wishlist.price);

    return GestureDetector(
      onTap: ontap,
      child: Container(
        margin: EdgeInsets.symmetric(vertical: 10.h, horizontal: 16.w),
        padding: EdgeInsets.all(12.r),
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
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            ClipRRect(
              borderRadius: BorderRadius.circular(12.r),
              child: SizedBox(
                width: 80.w,
                height: 80.h,
                child: Builder(
                  builder: (_) {
                    final imgUrl = wishlist.imgUrl;
                    if (imgUrl != null && imgUrl.startsWith('data:image')) {
                      try {
                        final base64Str = imgUrl.split(',').last;
                        return Image.memory(
                          base64Decode(base64Str),
                          fit: BoxFit.cover,
                          errorBuilder: (context, error, stackTrace) =>
                              const Icon(Icons.broken_image, size: 40),
                        );
                      } catch (_) {
                        return const Icon(Icons.broken_image, size: 40);
                      }
                    } else if (imgUrl != null && imgUrl.startsWith('http')) {
                      return Image.network(
                        imgUrl,
                        fit: BoxFit.cover,
                        errorBuilder: (context, error, stackTrace) =>
                            const Icon(Icons.broken_image, size: 40),
                      );
                    } else {
                      return Image.network(
                        "https://plus.unsplash.com/premium_photo-1664472724753-0a4700e4137b?q=80&w=1780&auto=format&fit=crop",
                        fit: BoxFit.cover,
                        errorBuilder: (context, error, stackTrace) =>
                            const Icon(Icons.broken_image, size: 40),
                      );
                    }
                  },
                ),
              ),
            ),
            SizedBox(width: 12.w),
            Expanded(
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Expanded(
                    child: Column(
                      mainAxisSize: MainAxisSize.max,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                      children: [
                        ReusableText(
                          text: wishlist.name,
                          style: appStyle(14, Kfoundation, FontWeight.w600),
                          maxlines: 2,
                        ),
                        SizedBox(height: 4.h),
                        ReusableText(
                          text: brandName,
                          style: appStyle(12, Colors.grey, FontWeight.w400),
                        ),
                        SizedBox(height: 20.h),
                        wishlist.isDiscounted && wishlist.discountAmount > 0
                            ? Row(
                                children: [
                                  ReusableText(
                                    text:
                                        "EGP ${discountedPrice.toStringAsFixed(2)}",
                                    style: appStyle(
                                        13, kDarkBlue, FontWeight.bold),
                                  ),
                                  SizedBox(width: 6.w),
                                  ReusableText(
                                    text:
                                        "EGP ${wishlist.price.toStringAsFixed(2)}",
                                    style: appStyle(12, kGray, FontWeight.w400)
                                        .copyWith(
                                      decoration: TextDecoration.lineThrough,
                                    ),
                                  ),
                                ],
                              )
                            : ReusableText(
                                text:
                                    "EGP ${wishlist.price.toStringAsFixed(2)}",
                                style: appStyle(13, kDarkBlue, FontWeight.bold),
                              ),
                      ],
                    ),
                  ),
                  Column(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children: [
                      GestureDetector(
                        onTap: () async {
                          await wishlistController
                              .addAndRemoveWishList(wishlist.id);
                          await refetch?.call();
                        },
                        child: const Icon(
                          CupertinoIcons.heart_fill,
                          color: kRed,
                        ),
                      ),
                      SizedBox(height: 40.h),
                      GestureDetector(
                        onTap: () async {
                          await cartController.addToCart(
                            productId: wishlist.id,
                            quantity: 1,
                            color: wishlist.colors.isNotEmpty
                                ? wishlist.colors[0]
                                : 'Default',
                            size: wishlist.sizes.isNotEmpty
                                ? wishlist.sizes[0]
                                : 'Default',
                          );
                        },
                        child: Icon(
                          Icons.shopping_bag_outlined,
                          color: Kfoundation,
                          size: 24.h,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
