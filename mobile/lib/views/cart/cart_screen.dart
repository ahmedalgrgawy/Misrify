import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';
import 'package:graduation_project1/common/app_style.dart';
import 'package:graduation_project1/common/custom_button.dart';
import 'package:graduation_project1/common/reusable_text.dart';
import 'package:graduation_project1/common/shimmers/foodlist_shimmer.dart';
import 'package:graduation_project1/constants/constants.dart';
import 'package:graduation_project1/controllers/controllers.auth/login_controller.dart';
import 'package:graduation_project1/hooks/fetch_cart.dart';
import 'package:graduation_project1/hooks/fetch_all_products.dart';
import 'package:graduation_project1/models/cart_response.dart';
import 'package:graduation_project1/models/products_model.dart';
import 'package:graduation_project1/views/auth/login_redirect.dart';
import 'package:graduation_project1/views/cart/widgets/cart_tile.dart';
import 'package:graduation_project1/models/products_model.dart' as models;

import 'package:graduation_project1/views/entrypoint.dart';

class CartScreen extends HookWidget {
  const CartScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final hookResult = useFetchcart(); // your cart hook
    final productsHook = useFetchAllProducts(); // your products hook

    final cart = hookResult.data;
    final allProducts = productsHook.data ?? [];

    // Enrich cart items by matching product IDs
    final enrichedCartItems = cart?.cartItems.map((cartItem) {
          final matched = allProducts.firstWhere(
            (p) => p.id == cartItem.product.id,
            orElse: () => models.Product(
              id: cartItem.product.id,
              name: cartItem.product.name,
              // image: cartItem.product.image,
              price: cartItem.product.price,
              category: models.Brand.empty(),
              brand: models.Brand.empty(),
              description: '',
              quantityInStock: 0,
              colors: [],
              sizes: [],
              isDiscounted: false,
              discountAmount: 0,
              isApproved: false,
              reviews: [],
              createdAt: DateTime.now(),
              updatedAt: DateTime.now(),
              v: 0,
            ),
          );

          return CartItem(
            id: cartItem.id,
            product: matched,
            quantity: cartItem.quantity,
            color: cartItem.color,
            size: cartItem.size,
            price: cartItem.price,
            total: cartItem.total,
          );
        }).toList() ??
        [];

    final isLoading = hookResult.isLoading || productsHook.isLoading;
    final refetch = hookResult.refetch;

    final controller = Get.put(LoginController());
    final box = GetStorage();
    final token = box.read('token');
    final subtotal =
        enrichedCartItems.fold(0.0, (sum, item) => sum + item.total);
    final discount = enrichedCartItems.fold(
        0.0,
        (sum, item) => item.product.isDiscounted
            ? sum + item.product.discountAmount
            : sum);

    if (token == null) return const LoginRedirect();

    return Scaffold(
      body: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 12.0),
              child: Center(
                child: ReusableText(
                  text: 'Shopping Cart',
                  align: TextAlign.center,
                  style: appStyle(18, kDarkBlue, FontWeight.w600),
                ),
              ),
            ),
            if (isLoading)
              const Expanded(child: FoodsListShimmer())
            else if (enrichedCartItems.isEmpty)
              Expanded(
                child: Padding(
                  padding: const EdgeInsets.symmetric(
                      horizontal: 35.0, vertical: 40),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      SizedBox(
                        height: height * .33,
                        child: Image.asset(
                          'assets/banners/cart.png',
                          fit: BoxFit.contain,
                        ),
                      ),
                      SizedBox(height: 20.h),
                      ReusableText(
                        text: 'Your Cart is Empty!',
                        style: appStyle(20, kDarkBlue, FontWeight.w600),
                        align: TextAlign.center,
                      ),
                      SizedBox(height: 20.h),
                      ReusableText(
                        text:
                            'Tap add to Cart button to start adding your items',
                        style: appStyle(12, kDarkBlue, FontWeight.w400),
                        align: TextAlign.center,
                      ),
                      SizedBox(height: 20.h),
                      CustomButton(
                        onTap: () {
                          Get.offAll(() => MainScreen());
                        },
                        btnColor: Colors.white,
                        text: 'Add to Cart',
                        textcolor: kDarkBlue,
                        btnWidth: 300,
                        btnHeight: 60,
                        borderColor: kDarkBlue,
                      ),
                    ],
                  ),
                ),
              )
            else
              Expanded(
                child: Column(
                  children: [
                    Expanded(
                      child: ListView.builder(
                        key: ValueKey(enrichedCartItems.length),
                        padding: const EdgeInsets.symmetric(horizontal: 10.0),
                        itemCount: enrichedCartItems.length,
                        itemBuilder: (context, i) {
                          final item = enrichedCartItems[i];
                          return CartTile(
                            item: item,
                            refetch: () async {
                              if (refetch != null) await refetch();
                            },
                          );
                        },
                      ),
                    ),

                    // Cart Summary
                    Padding(
                      padding: EdgeInsets.symmetric(
                          horizontal: 20.w, vertical: 45.h),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              ReusableText(
                                text: 'Subtotal :',
                                style: appStyle(14, kGray, FontWeight.w400),
                              ),
                              ReusableText(
                                text:
                                    '\$${enrichedCartItems.fold(0.0, (sum, item) => sum + item.total).toStringAsFixed(2)}',
                                style: appStyle(14, kGray, FontWeight.w400),
                              ),
                            ],
                          ),
                          const SizedBox(height: 6),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              ReusableText(
                                text: 'Shipping Fee :',
                                style: appStyle(14, kGray, FontWeight.w400),
                              ),
                              ReusableText(
                                text: '\$0.00',
                                style: appStyle(14, kGray, FontWeight.w400),
                              ),
                            ],
                          ),
                          const SizedBox(height: 6),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              ReusableText(
                                text: 'Discount :',
                                style: appStyle(14, kGray, FontWeight.w400),
                              ),
                              ReusableText(
                                text:
                                    '-\$${enrichedCartItems.fold(0.0, (sum, item) => item.product.isDiscounted ? sum + item.product.discountAmount : sum).toStringAsFixed(2)}',
                                style: appStyle(14, kGray, FontWeight.w400),
                              ),
                            ],
                          ),
                          const SizedBox(height: 6),
                          const Divider(height: 25, thickness: 1),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              ReusableText(
                                text: 'Total :',
                                style:
                                    appStyle(18, Kfoundation, FontWeight.w600),
                              ),
                              ReusableText(
                                text:
                                    '\$${(subtotal - discount).toStringAsFixed(2)} ',
                                style:
                                    appStyle(18, Kfoundation, FontWeight.w600),
                              ),
                            ],
                          ),
                          const SizedBox(height: 12),
                          CustomButton(
                            onTap: () {
                              // TODO: Add checkout logic
                            },
                            btnColor: kLightBlue,
                            text: 'Checkout',
                            textcolor: Colors.white,
                            btnWidth: double.infinity,
                            btnHeight: 55,
                          ),
                        ],
                      ),
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
