import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:get/get.dart';
import 'package:graduation_project1/common/app_style.dart';
import 'package:graduation_project1/common/reusable_text.dart';
import 'package:graduation_project1/constants/constants.dart';
import 'package:graduation_project1/controllers/cart_controller.dart';
import 'package:graduation_project1/models/cart_response.dart';

class CartTile extends StatelessWidget {
  const CartTile({
    Key? key,
    required this.item,
    this.refetch,
  }) : super(key: key);

  final CartItem item;
  final Function()? refetch;

  @override
  Widget build(BuildContext context) {
    final controller = Get.put(CartController());
    final product = item.product;

    return Container(
      margin: EdgeInsets.symmetric(vertical: 10.h, horizontal: 16.w),
      padding: EdgeInsets.all(10.r),
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
            child: Image.network(
              // product.image.isNotEmpty
              //     ? product.image
              "https://plus.unsplash.com/premium_photo-1664472724753-0a4700e4137b?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              width: 80.w,
              height: 80.h,
              fit: BoxFit.cover,
            ),
          ),
          SizedBox(width: 12.w),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                ReusableText(
                  text: product.name,
                  style: appStyle(14, Kfoundation, FontWeight.w600),
                  maxlines: 1,
                ),
                SizedBox(height: 4.h),
                ReusableText(
                  text: product.brand.name,
                  style: appStyle(12, Colors.grey, FontWeight.w400),
                ),
                SizedBox(height: 10.h),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    ReusableText(
                      text: "\$${item.total.toStringAsFixed(2)}",
                      style: appStyle(14, kDarkBlue, FontWeight.w600),
                    ),
                    Align(
                      alignment: Alignment.bottomRight,
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          RawMaterialButton(
                            onPressed: () async {
                              if (item.quantity > 1) {
                                await controller.updateCartItemQuantity(
                                  cartItemId: item.id,
                                  operation: "minus",
                                );
                              } else {
                                await controller.removeFromCart(item.id);
                              }
                              await refetch?.call();
                            },
                            fillColor: Colors.white,
                            shape: const CircleBorder(),
                            constraints: BoxConstraints.tightFor(
                                width: 28.w, height: 28.h),
                            child: const Icon(Icons.remove,
                                color: Kfoundation, size: 18),
                          ),
                          SizedBox(width: 4.w),
                          ReusableText(
                            text: item.quantity.toString(),
                            style: appStyle(14, Kfoundation, FontWeight.w600),
                          ),
                          SizedBox(width: 4.w),
                          RawMaterialButton(
                            onPressed: () async {
                              await controller.updateCartItemQuantity(
                                cartItemId: item.id,
                                operation: "add",
                              );
                              await refetch?.call();
                            },
                            fillColor: Colors.white,
                            shape: const CircleBorder(),
                            constraints: BoxConstraints.tightFor(
                                width: 28.w, height: 28.h),
                            child: const Icon(Icons.add,
                                color: Kfoundation, size: 18),
                          ),
                        ],
                      ),
                    )
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
