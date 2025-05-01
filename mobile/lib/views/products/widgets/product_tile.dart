// ignore_for_file: prefer_const_constructors_in_immutables

import 'package:flutter/material.dart';
import 'package:flutter_rating_bar/flutter_rating_bar.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:flutter_vector_icons/flutter_vector_icons.dart';
import 'package:get/get.dart';
import 'package:graduation_project1/common/app_style.dart';
import 'package:graduation_project1/common/reusable_text.dart';
import 'package:graduation_project1/constants/constants.dart';
import 'package:graduation_project1/controllers/wishlist_controller.dart';
import 'package:graduation_project1/models/products_model.dart';
import 'package:graduation_project1/views/products/Product_page.dart';

class ProductTile extends StatelessWidget {
  ProductTile(
      {super.key,
      required this.product,
      this.color,
      this.title = 'product',
      this.brand = 'soul',
      this.price = '40.9'});
  final Color? color;
  final String? title;
  final String? brand;
  final String? price;
  late bool isSelected = false;

  Product product;
  @override
  Widget build(BuildContext context) {
    final controller = Get.put(WishlistController());
    return GestureDetector(
      onTap: () {
        Get.to(() => ProductPage());
      },
      child: Stack(
        children: [
          Container(
            margin: EdgeInsets.only(bottom: 8.h),
            height: 95.h,
            width: width,
            decoration: BoxDecoration(
                color: Colors.white, borderRadius: BorderRadius.circular(9.r)),
            child: Container(
              padding: EdgeInsets.all(4.r),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  ClipRRect(
                    borderRadius: BorderRadius.all(Radius.circular(12.r)),
                    child: Stack(
                      children: [
                        SizedBox(
                          width: 80.w,
                          height: 90.h,
                          child: Image.network(
                            "https://plus.unsplash.com/premium_photo-1664472724753-0a4700e4137b?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                            fit: BoxFit.cover,
                          ),
                        ),
                        // Positioned(
                        //     bottom: 0,
                        //     child: Container(
                        //       padding: EdgeInsets.only(left: 6.w, bottom: 2.h),
                        //       color: kGray.withOpacity(0.6),
                        //       height: 16.h,
                        //       width: width,
                        //       child: RatingBarIndicator(
                        //         rating: 5,
                        //         itemCount: 5,
                        //         itemBuilder: (context, i) => const Icon(
                        //           Icons.star,
                        //           color: kSecondary,
                        //         ),
                        //         itemSize: 15.h,
                        //       ),
                        //     ))
                      ],
                    ),
                  ),
                  SizedBox(
                    width: 10.w,
                  ),
                  Column(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      ReusableText(
                          text: title!,
                          style: appStyle(14, Kfoundation, FontWeight.w600)),
                      ReusableText(
                          text: brand!,
                          style: appStyle(12, kGray, FontWeight.w400)),
                      SizedBox(
                        width: width * 0.7,
                        height: 18.h,
                        child: ReusableText(
                            text: price!,
                            style: appStyle(12, Kfoundation, FontWeight.w400)),
                      )
                    ],
                  )
                ],
              ),
            ),
          ),
          Positioned(
              right: 5.w,
              top: 6.h,
              child: GestureDetector(
                  onTap: () {
                    isSelected = true;
                  },
                  child: isSelected
                      ? const Icon(
                          Icons.favorite,
                          color: kRed,
                        )
                      : const Icon(
                          Icons.favorite_border,
                          color: kDarkBlue,
                        ))),
          Positioned(
            right: 75.w,
            top: 6.h,
            child: GestureDetector(
              onTap: () {
                // var data = CartRequest(
                //     productId: food.id,
                //     additives: [],
                //     quantity: 1,
                //     totalPrice: food.price);
                // String cart = cartRequestToJson(data);
                // controller.addToCart(cart);
              },
              child: Center(
                child: Icon(
                  MaterialCommunityIcons.cart_plus,
                  color: Kfoundation,
                  size: 15.h,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
