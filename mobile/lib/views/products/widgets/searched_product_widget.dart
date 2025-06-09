import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:get/get.dart';
import 'package:graduation_project1/common/app_style.dart';
import 'package:graduation_project1/common/reusable_text.dart';
import 'package:graduation_project1/constants/constants.dart';
import 'package:graduation_project1/models/products_model.dart';
import 'package:graduation_project1/views/products/Product_page.dart';

class SearchedProductWidget extends StatelessWidget {
  SearchedProductWidget({super.key, required this.product});
  Product product;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        Get.to(() => ProductDetailScreen(product: product));
      },
      child: Padding(
        padding: EdgeInsets.only(left: 10.w, right: 5.w),
        child: Container(
          padding: EdgeInsets.symmetric(vertical: 4.w),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(8.r),
            color: Colors.white,
          ),
          child: ListView(
            physics: const NeverScrollableScrollPhysics(),
            children: [
              Padding(
                padding: EdgeInsets.all(8.w),
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(10.r),
                  child: SizedBox(
                    height: 127.h,
                    width: 170.w,
                    child: Image.network(
                      product.imgUrl ??
                          "https://plus.unsplash.com/premium_photo-1664472724753-0a4700e4137b?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                      fit: BoxFit.fitWidth,
                    ),
                  ),
                ),
              ),
              Padding(
                padding: EdgeInsets.symmetric(vertical: 4.w),
                child: Stack(
                  children: [
                    Positioned(
                      right: 6,
                      child: CircleAvatar(
                        radius: 12.r,
                        backgroundColor: Kblack,
                        child: Center(
                          child: InkWell(
                            child: const Icon(
                              Icons.favorite_outline,
                              color: Colors.white,
                              size: 16,
                            ),
                            onTap: () {},
                          ),
                        ),
                      ),
                    ),
                    Padding(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 12.0,
                      ),
                      child: SizedBox(
                        width: 120.w,
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.spaceAround,
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            ReusableText(
                                text: product.name,
                                maxlines: 4,
                                SoftWrap: true,
                                style:
                                    appStyle(12, KTextColor, FontWeight.w700)),
                            SizedBox(
                              height: 10.h,
                            ),
                            ReusableText(
                                text: product.brand.name,
                                style: appStyle(10, kGray, FontWeight.w400)),
                            SizedBox(
                              height: 10.h,
                            ),
                            ReusableText(
                                text: "\$ ${product.price}",
                                style:
                                    appStyle(12, KTextColor, FontWeight.w700)),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              )
            ],
          ),
        ),
      ),
    );
  }
}
