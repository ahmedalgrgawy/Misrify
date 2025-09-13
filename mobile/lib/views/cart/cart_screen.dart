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
import 'package:graduation_project1/controllers/cart_controller.dart';
import 'package:graduation_project1/controllers/coupon_controller.dart';
import 'package:graduation_project1/hooks/fetch_cart.dart';
import 'package:graduation_project1/hooks/fetch_all_products.dart';
import 'package:graduation_project1/models/cart_response.dart';
import 'package:graduation_project1/hooks/fetch_all_orders.dart';

import 'package:graduation_project1/models/products_model.dart';
import 'package:graduation_project1/views/auth/login_redirect.dart';
import 'package:graduation_project1/views/cart/widgets/cart_tile.dart';
import 'package:graduation_project1/views/entrypoint.dart';
import 'package:graduation_project1/views/home/widgets/SectionHeading.dart';
import 'package:graduation_project1/views/orders/confirm_order_screen.dart';
import 'package:graduation_project1/views/profile/points_screen.dart';

class CartScreen extends HookWidget {
  final bool fromAppBar;
  const CartScreen({super.key, this.fromAppBar = false});

  @override
  Widget build(BuildContext context) {
    final hookResult = useFetchcart();
    final productsHook = useFetchAllProducts();
    final cartController = Get.find<CartController>();
    final ordersHook = useFetchOrders();
    final hasOrders = ordersHook.data?.isNotEmpty ?? false;

    final CouponController couponController = Get.put(CouponController());

    final cart = hookResult.data;
    final allProducts = productsHook.data ?? [];

    final List<CartItem> enrichedCartItems =
        (cart?.cartItems.map<CartItem>((cartItem) {
              final matched = allProducts.firstWhere(
                (p) => p.id == cartItem.product.id,
                orElse: () => Product(
                  id: cartItem.product.id,
                  name: cartItem.product.name,
                  price: cartItem.product.price,
                  category: Brand.empty(),
                  brand: Brand.empty(),
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
            }).toList()) ??
            [];

    useEffect(() {
      Future.microtask(() {
        final int totalQuantity = enrichedCartItems.fold<int>(
          0,
          (sum, item) => sum + item.quantity,
        );
        cartController.updateItemCount(totalQuantity);
      });
      return null;
    }, [enrichedCartItems]);

    final isLoading = hookResult.isLoading || productsHook.isLoading;
    final refetch = hookResult.refetch;

    final token = GetStorage().read('token');
    if (token == null) return const LoginRedirect();

    final subtotal =
        enrichedCartItems.fold(0.0, (sum, item) => sum + item.total);
    final discount = enrichedCartItems.fold(
      0.0,
      (sum, item) => item.product.isDiscounted
          ? sum + (item.product.discountAmount * item.quantity)
          : sum,
    );

    final shippingFee = hasOrders ? 60.0 : 0.0;
    final totalBeforeCoupon = subtotal - discount + shippingFee;

    return Scaffold(
        appBar: AppBar(
          backgroundColor: Kbackground,
          elevation: 0,
          centerTitle: true,
          automaticallyImplyLeading: false,
          leading: fromAppBar
              ? IconButton(
                  icon: const Icon(Icons.arrow_back, color: KTextColor),
                  onPressed: () => Get.back(),
                )
              : null,
          title: ReusableText(
            text: 'Shopping Cart',
            align: TextAlign.center,
            style: appStyle(18, KTextColor, FontWeight.w600),
          ),
          actions: [
            Obx(() {
              final hasItems = cartController.itemCount.value > 0;
              return hasItems
                  ? IconButton(
                      icon: const Icon(Icons.delete_outline, color: Colors.red),
                      tooltip: 'Clear All',
                      onPressed: () => _showClearAllSheet(context, refetch),
                    )
                  : const SizedBox.shrink();
            }),
          ],
        ),
        body: SafeArea(
            child: isLoading
                ? const FoodsListShimmer()
                : enrichedCartItems.isEmpty
                    ? _buildEmptyCart(context)
                    : _buildCartContent(
                        context,
                        enrichedCartItems,
                        subtotal,
                        discount,
                        shippingFee,
                        totalBeforeCoupon,
                        couponController,
                        refetch)));
  }

  Widget _buildEmptyCart(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 35.0, vertical: 40),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          SizedBox(
            height: MediaQuery.of(context).size.height * .33,
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
            text: 'Tap add to Cart button to start adding your items',
            style: appStyle(12, kDarkBlue, FontWeight.w400),
            align: TextAlign.center,
          ),
          SizedBox(height: 20.h),
          CustomButton(
            onTap: () => Get.offAll(() => MainScreen()),
            btnColor: Colors.white,
            text: 'Add to Cart',
            textcolor: kDarkBlue,
            btnWidth: 300,
            btnHeight: 60,
            borderColor: kDarkBlue,
          ),
        ],
      ),
    );
  }

  Widget _buildCartContent(
      BuildContext context,
      List<CartItem> items,
      double subtotal,
      double discount,
      double shippingFee,
      double totalBeforeCoupon,
      CouponController couponController,
      Future<void> Function()? refetch) {
    return Column(
      children: [
        Expanded(
          child: ListView.builder(
            key: ValueKey(items.length),
            padding: const EdgeInsets.symmetric(horizontal: 10.0),
            itemCount: items.length,
            itemBuilder: (context, i) {
              final item = items[i];
              return CartTile(
                item: item,
                refetch: () async => await refetch!(),
              );
            },
          ),
        ),
        Obx(() {
          final couponDiscount =
              couponController.appliedDiscount.value.toDouble();
          final totalAfterCoupon =
              totalBeforeCoupon * (1 - (couponDiscount / 100));

          return Padding(
            padding: EdgeInsets.symmetric(horizontal: 20.w, vertical: 45.h),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                SectionHeading(
                  title: 'Coupons',
                  showButton: true,
                  padd: EdgeInsets.zero,
                  onPress: () {
                    Get.to(const PointsScreen());
                  },
                ),
                TextField(
                  controller: couponController.couponTextController,
                  decoration: InputDecoration(
                    hintText: 'Enter Coupon Code',
                    hintStyle: appStyle(14, kLightGray, FontWeight.w400),
                    filled: true,
                    fillColor: Colors.white,
                    contentPadding:
                        EdgeInsets.symmetric(horizontal: 16.w, vertical: 12.h),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(4.r),
                      borderSide: BorderSide.none,
                    ),
                    suffixIcon: ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: kNavy,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.only(
                            topRight: Radius.circular(4.r),
                            bottomRight: Radius.circular(4.r),
                          ),
                        ),
                      ),
                      onPressed: () async {
                        await couponController.applyCoupon();
                      },
                      child: Text("Apply",
                          style: appStyle(14, Colors.white, FontWeight.w500)),
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                _buildPriceRow(
                    'Subtotal :', 'EGP ${subtotal.toStringAsFixed(2)}'),
                _buildPriceRow(
                    'Shipping Fee :', 'EGP ${shippingFee.toStringAsFixed(2)}'),
                _buildPriceRow(
                    'Discount :', '-EGP ${discount.toStringAsFixed(2)}'),
                if (couponDiscount > 0)
                  _buildPriceRow(
                      'Coupon :', '-${couponDiscount.toStringAsFixed(0)}%'),
                const Divider(height: 25, thickness: 1),
                _buildPriceRow(
                    'Total :', 'EGP ${totalAfterCoupon.toStringAsFixed(2)}',
                    bold: true),
                const SizedBox(height: 12),
                CustomButton(
                  onTap: () {
                    Get.to(const ConfirmOrderScreen());
                  },
                  btnColor: kNavy,
                  text: 'Checkout',
                  textcolor: Colors.white,
                  btnWidth: double.infinity,
                  btnHeight: 55,
                ),
              ],
            ),
          );
        })
      ],
    );
  }

  Widget _buildPriceRow(String label, String value, {bool bold = false}) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        ReusableText(
          text: label,
          style: appStyle(
            bold ? 18 : 14,
            bold ? Kfoundation : kGray,
            bold ? FontWeight.w600 : FontWeight.w400,
          ),
        ),
        ReusableText(
          text: value,
          style: appStyle(
            bold ? 18 : 14,
            bold ? Kfoundation : kGray,
            bold ? FontWeight.w600 : FontWeight.w400,
          ),
        ),
      ],
    );
  }

  void _showClearAllSheet(
      BuildContext context, Future<void> Function()? refetch) {
    final cartController = Get.find<CartController>();

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
              Icon(Icons.warning_amber_rounded, size: 40.r, color: kRed),
              SizedBox(height: 10.h),
              Text(
                "Are you sure you want to clear your cart?",
                style: appStyle(14, Kfoundation, FontWeight.w500),
                textAlign: TextAlign.center,
              ),
              SizedBox(height: 20.h),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: kRed,
                      foregroundColor: Colors.white,
                      padding: EdgeInsets.symmetric(horizontal: 24.w),
                    ),
                    onPressed: () async {
                      Navigator.pop(context);
                      await cartController.clearCart();
                      await cartController.refreshCartCount();
                      await refetch?.call();
                    },
                    child: const Text("Yes, Clear"),
                  ),
                  ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: kLightBlue,
                      foregroundColor: Colors.white,
                      padding: EdgeInsets.symmetric(horizontal: 24.w),
                    ),
                    onPressed: () => Navigator.pop(context),
                    child: const Text("No, Cancel"),
                  ),
                ],
              )
            ],
          ),
        );
      },
    );
  }
}
