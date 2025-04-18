// ignore_for_file: must_be_immutable

import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:graduation_project1/common/app_style.dart';
import 'package:graduation_project1/common/reusable_text.dart';
import 'package:graduation_project1/constants/constants.dart';

class ProductWidget extends StatelessWidget {
  ProductWidget(
      {super.key,
      this.image,
      required this.brand,
      required this.price,
      this.onTap,
      required this.title});
  final String? image;
  final String title;
  final String brand;
  final String price;
  void Function()? onTap;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
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
                              Icons.add,
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
                                text: title,
                                maxlines: 4,
                                SoftWrap: true,
                                style:
                                    appStyle(12, KTextColor, FontWeight.w700)),
                            SizedBox(
                              height: 10.h,
                            ),
                            ReusableText(
                                text: brand,
                                style: appStyle(10, kGray, FontWeight.w400)),
                            SizedBox(
                              height: 10.h,
                            ),
                            ReusableText(
                                text: "\$ $price",
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
