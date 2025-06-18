import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:get/get.dart';
import 'package:graduation_project1/common/app_style.dart';
import 'package:graduation_project1/common/reusable_text.dart';
import 'package:graduation_project1/constants/constants.dart';
import 'package:graduation_project1/controllers/cart_controller.dart';
import 'package:graduation_project1/models/cart_response.dart';
import 'package:graduation_project1/views/products/Product_page.dart';

class CartTile extends StatefulWidget {
  const CartTile({Key? key, required this.item, this.refetch})
      : super(key: key);

  final CartItem item;
  final Function()? refetch;

  @override
  State<CartTile> createState() => _CartTileState();
}

class _CartTileState extends State<CartTile> {
  bool isLoading = false;

  Future<void> handleQuantityChange(String operation) async {
    final controller = Get.find<CartController>();
    setState(() => isLoading = true);

    if (operation == "minus" && widget.item.quantity == 1) {
      await controller.removeFromCart(widget.item.id);
    } else {
      await controller.updateCartItemQuantity(
        cartItemId: widget.item.id,
        operation: operation,
      );
    }

    await controller.refreshCartCount();
    await widget.refetch?.call();
    if (mounted) setState(() => isLoading = false);
  }

  @override
  Widget build(BuildContext context) {
    final controller = Get.put(CartController());
    final product = widget.item.product;

    return GestureDetector(
      onTap: () => Get.to(() => ProductDetailScreen(product: product)),
      onLongPress: () {
        showModalBottomSheet(
          context: context,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.vertical(top: Radius.circular(16.r)),
          ),
          builder: (_) {
            return Padding(
              padding: EdgeInsets.all(16.r),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(Icons.warning_amber_rounded,
                      size: 40.r, color: Colors.red),
                  SizedBox(height: 10.h),
                  Text(
                    "Are you sure you want to remove this item from your cart?",
                    style: appStyle(14, Kfoundation, FontWeight.w500),
                    textAlign: TextAlign.center,
                  ),
                  SizedBox(height: 20.h),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children: [
                      ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.red,
                          foregroundColor: Colors.white,
                          padding: EdgeInsets.symmetric(horizontal: 24.w),
                        ),
                        onPressed: () async {
                          Navigator.pop(context);
                          await controller.removeFromCart(widget.item.id);
                          await controller.refreshCartCount();
                          await widget.refetch?.call();
                        },
                        child: const Text("Yes, Remove"),
                      ),
                      ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: kLightBlue,
                          foregroundColor: Colors.white,
                          padding: EdgeInsets.symmetric(horizontal: 24.w),
                        ),
                        onPressed: () => Navigator.pop(context),
                        child: const Text("No, Keep"),
                      ),
                    ],
                  )
                ],
              ),
            );
          },
        );
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
                  child: () {
                    if (product.imgUrl != null &&
                        product.imgUrl!.startsWith('data:image')) {
                      try {
                        final base64Str = product.imgUrl!.split(',').last;
                        return Image.memory(
                          base64Decode(base64Str),
                          fit: BoxFit.cover,
                          errorBuilder: (_, __, ___) =>
                              const Icon(Icons.broken_image, size: 50),
                        );
                      } catch (_) {
                        return const Icon(Icons.broken_image, size: 50);
                      }
                    } else if (product.imgUrl != null &&
                        product.imgUrl!.startsWith('http')) {
                      return Image.network(
                        product.imgUrl!,
                        fit: BoxFit.cover,
                        errorBuilder: (_, __, ___) =>
                            const Icon(Icons.broken_image, size: 50),
                      );
                    } else {
                      return Image.network(
                        "https://plus.unsplash.com/premium_photo-1664472724753-0a4700e4137b?q=80&w=1780&auto=format&fit=crop",
                        fit: BoxFit.cover,
                        errorBuilder: (_, __, ___) =>
                            const Icon(Icons.broken_image, size: 50),
                      );
                    }
                  }(),
                ),
              ),
              SizedBox(width: 12.w),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    ReusableText(
                      text: product.name,
                      maxlines: 1,
                      style: appStyle(14, Kfoundation, FontWeight.w600),
                    ),
                    SizedBox(height: 4.h),
                    ReusableText(
                      text: product.brand.name,
                      style: appStyle(12, Colors.grey, FontWeight.w400),
                    ),
                    SizedBox(height: 6.h),
                    Row(
                      children: [
                        if (widget.item.color.isNotEmpty &&
                            widget.item.color.toLowerCase() != 'default')
                          Container(
                            padding: EdgeInsets.symmetric(
                                horizontal: 6.w, vertical: 2.h),
                            decoration: BoxDecoration(
                              color: Colors.grey.shade100,
                              borderRadius: BorderRadius.circular(4.r),
                            ),
                            child: ReusableText(
                              text: "Color: ${widget.item.color}",
                              style: appStyle(12, Kfoundation, FontWeight.w400),
                            ),
                          ),
                        if (widget.item.size.isNotEmpty &&
                            widget.item.size.toLowerCase() != 'default') ...[
                          SizedBox(width: 8.w),
                          Container(
                            padding: EdgeInsets.symmetric(
                                horizontal: 6.w, vertical: 2.h),
                            decoration: BoxDecoration(
                              color: Colors.grey.shade100,
                              borderRadius: BorderRadius.circular(4.r),
                            ),
                            child: ReusableText(
                              text: "Size: ${widget.item.size}",
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
                          text: "EGP ${widget.item.total.toStringAsFixed(2)}",
                          style: appStyle(14, kDarkBlue, FontWeight.w600),
                        ),
                        isLoading
                            ? const SizedBox(
                                width: 24,
                                height: 24,
                                child: CircularProgressIndicator(
                                  strokeWidth: 2,
                                  color: kGray,
                                ),
                              )
                            : Row(
                                children: [
                                  RawMaterialButton(
                                    onPressed: () =>
                                        handleQuantityChange("minus"),
                                    fillColor: Colors.white,
                                    shape: const CircleBorder(),
                                    constraints: BoxConstraints.tightFor(
                                        width: 28.w, height: 28.h),
                                    child: const Icon(Icons.remove,
                                        color: Kfoundation, size: 18),
                                  ),
                                  SizedBox(width: 4.w),
                                  ReusableText(
                                    text: widget.item.quantity.toString(),
                                    style: appStyle(
                                        14, Kfoundation, FontWeight.w600),
                                  ),
                                  SizedBox(width: 4.w),
                                  RawMaterialButton(
                                    onPressed: () =>
                                        handleQuantityChange("add"),
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
