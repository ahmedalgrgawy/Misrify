import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:flutter_vector_icons/flutter_vector_icons.dart';
import 'package:get/get.dart';
import 'package:graduation_project1/common/app_style.dart';
import 'package:graduation_project1/common/reusable_text.dart';
import 'package:graduation_project1/constants/constants.dart';
import 'package:graduation_project1/controllers/wishlist_controller.dart';
import 'package:graduation_project1/models/wishlist_response.dart';

class WishlistTile extends StatelessWidget {
  const WishlistTile({
    Key? key,
    required this.wishlist,
    this.color,
    this.refetch,
  }) : super(key: key);

  final Color? color;
  final Function()? refetch;
  final WishlistItem wishlist;

  @override
  Widget build(BuildContext context) {
    final controller = Get.find<WishlistController>();

    return GestureDetector(
      onTap: () {},
      child: Container(
        margin: EdgeInsets.symmetric(vertical: 6.h, horizontal: 10.w),
        padding: EdgeInsets.all(8.r),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(9.r),
        ),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            ClipRRect(
              borderRadius: BorderRadius.all(Radius.circular(12.r)),
              child: Image.network(
                "https://plus.unsplash.com/premium_photo-1664472724753-0a4700e4137b?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                width: 80.w,
                height: 80.h,
                fit: BoxFit.cover,
              ),
            ),
            SizedBox(width: 10.w),
            Expanded(
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        ReusableText(
                          text: wishlist.name,
                          style: appStyle(14, Kfoundation, FontWeight.w600),
                          maxlines: 1,
                        ),
                        SizedBox(height: 6.h),
                        ReusableText(
                          text: "\$ ${wishlist.price}",
                          style: appStyle(12, Kfoundation, FontWeight.w400),
                        ),
                      ],
                    ),
                  ),
                  Column(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children: [
                      GestureDetector(
                        onTap: () async {
                          await controller.addAndRemoveWishList(wishlist.id);
                          await refetch?.call();
                        },
                        child: const Icon(
                          CupertinoIcons.heart_fill,
                          color: kRed,
                        ),
                      ),
                      SizedBox(height: 40.h),
                      GestureDetector(
                        onTap: () {},
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
