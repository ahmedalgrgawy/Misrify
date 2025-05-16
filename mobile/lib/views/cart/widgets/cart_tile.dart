import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:get/get.dart';
import 'package:graduation_project1/common/app_style.dart';
import 'package:graduation_project1/common/reusable_text.dart';
import 'package:graduation_project1/constants/constants.dart';
import 'package:graduation_project1/controllers/cart_controller.dart';
import 'package:graduation_project1/models/cart_response.dart';
import 'package:graduation_project1/views/products/Product_page.dart';

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

    return GestureDetector(
      onTap: () {
        Get.to(() => ProductDetailScreen(product: product));
      },
      child: Container(
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
        child: IntrinsicHeight(
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              ClipRRect(
                borderRadius: BorderRadius.circular(12.r),
                child: SizedBox(
                  width: 80.w,
                  child: Image.network(
                    "https://plus.unsplash.com/premium_photo-1664472724753-0a4700e4137b?q=80&w=1780&auto=format&fit=crop",
                    fit: BoxFit.cover,
                  ),
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
                    SizedBox(height: 6.h),

                    // ✅ Display color and size
                    Row(
                      children: [
                        if (item.color.isNotEmpty &&
                            item.color.toLowerCase() != 'default')
                          Container(
                            padding: EdgeInsets.symmetric(
                                horizontal: 6.w, vertical: 2.h),
                            decoration: BoxDecoration(
                              color: Colors.grey.shade100,
                              borderRadius: BorderRadius.circular(4.r),
                            ),
                            child: ReusableText(
                              text: "Color: ${item.color}",
                              style: appStyle(12, Kfoundation, FontWeight.w400),
                            ),
                          ),
                        if (item.size.isNotEmpty &&
                            item.size.toLowerCase() != 'default') ...[
                          SizedBox(width: 8.w),
                          Container(
                            padding: EdgeInsets.symmetric(
                                horizontal: 6.w, vertical: 2.h),
                            decoration: BoxDecoration(
                              color: Colors.grey.shade100,
                              borderRadius: BorderRadius.circular(4.r),
                            ),
                            child: ReusableText(
                              text: "Size: ${item.size}",
                              style: appStyle(12, Kfoundation, FontWeight.w400),
                            ),
                          ),
                        ],
                      ],
                    ),

                    SizedBox(height: 10.h),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        ReusableText(
                          text: "\$${item.total.toStringAsFixed(2)}",
                          style: appStyle(14, kDarkBlue, FontWeight.w600),
                        ),
                        Row(
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
                                await controller.refreshCartCount();
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
                                await controller.refreshCartCount();
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
                        )
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
