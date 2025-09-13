import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';
import 'package:graduation_project1/hooks/fetch_all_orders.dart';
import 'package:graduation_project1/common/app_style.dart';
import 'package:graduation_project1/common/custom_button.dart';
import 'package:graduation_project1/common/reusable_text.dart';
import 'package:graduation_project1/common/shimmers/foodlist_shimmer.dart';
import 'package:graduation_project1/constants/constants.dart';
import 'package:graduation_project1/controllers/cart_controller.dart';
import 'package:graduation_project1/controllers/coupon_controller.dart';
import 'package:graduation_project1/controllers/order_controller.dart';
import 'package:graduation_project1/hooks/fetch_cart.dart';
import 'package:graduation_project1/hooks/fetch_all_products.dart';
import 'package:graduation_project1/models/cart_response.dart';
import 'package:graduation_project1/models/products_model.dart';
import 'package:graduation_project1/views/auth/login_redirect.dart';
import 'package:graduation_project1/views/home/widgets/SectionHeading.dart';
import 'package:graduation_project1/views/orders/payment_screen.dart';
import 'package:graduation_project1/views/orders/success_order_screen.dart';
import 'package:graduation_project1/views/orders/widgets/order_items.dart';

// ... (import statements remain unchanged)

class ConfirmOrderScreen extends HookWidget {
  final bool fromAppBar;
  const ConfirmOrderScreen({super.key, this.fromAppBar = false});

  @override
  Widget build(BuildContext context) {
    final hookResult = useFetchcart();
    final ordersHook = useFetchOrders();
    final hasOrders = ordersHook.data?.isNotEmpty ?? false;
    final shippingFee = hasOrders ? 60.0 : 0.0;

    final productsHook = useFetchAllProducts();
    final cartController = Get.find<CartController>();
    late final TextEditingController addressController =
        TextEditingController();
    final CouponController couponController = Get.find<CouponController>();
    final orderController = Get.put(OrderController());
    final RxString selectedPaymentMethod = ''.obs;

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

    final totalBeforeCoupon = subtotal - discount + shippingFee;

    return Scaffold(
      body: SafeArea(
        child: isLoading
            ? const FoodsListShimmer()
            : SingleChildScrollView(
                padding: EdgeInsets.only(bottom: 30.h),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Padding(
                      padding: EdgeInsets.symmetric(
                          horizontal: 16.w, vertical: 12.h),
                      child: Row(
                        children: [
                          GestureDetector(
                            onTap: () => Get.back(),
                            child: const Icon(Icons.arrow_back_ios,
                                color: kDarkBlue),
                          ),
                          const SizedBox(width: 10),
                          ReusableText(
                            text: 'Confirm Order',
                            style: appStyle(18, kDarkBlue, FontWeight.w600),
                          ),
                        ],
                      ),
                    ),
                    ListView.builder(
                      physics: const NeverScrollableScrollPhysics(),
                      shrinkWrap: true,
                      key: ValueKey(enrichedCartItems.length),
                      padding: const EdgeInsets.symmetric(horizontal: 10.0),
                      itemCount: enrichedCartItems.length,
                      itemBuilder: (context, i) {
                        final item = enrichedCartItems[i];
                        return OrderItems(
                          item: item,
                          refetch: () async => {},
                        );
                      },
                    ),
                    const SectionHeading(title: 'Address', showButton: false),
                    Padding(
                      padding: const EdgeInsets.only(right: 30.0, left: 30, top: 10),
                      child: TextFormField(
                        controller: addressController,
                        maxLines: 2,
                        style: appStyle(14, kBlue, FontWeight.w400),
                        decoration: InputDecoration(
                          filled: true,
                          hintText: "Enter your address",
                          hintStyle: appStyle(14, kLightGray, FontWeight.w400),
                          fillColor: Colors.white,
                          isDense: true,
                          contentPadding: EdgeInsets.symmetric(
                              vertical: 10.h, horizontal: 12.w),
                          disabledBorder: const OutlineInputBorder(
                              borderSide:
                                  BorderSide(color: kLightWhite, width: .5)),
                          border: const OutlineInputBorder(
                              borderSide:
                                  BorderSide(color: kLightWhite, width: .5)),
                          enabledBorder: const OutlineInputBorder(
                              borderSide:
                                  BorderSide(color: kLightWhite, width: .5)),
                          focusedBorder: const OutlineInputBorder(
                              borderSide:
                                  BorderSide(color: kLightWhite, width: .5)),
                          errorBorder: const OutlineInputBorder(
                              borderSide: BorderSide(color: kRed, width: .5)),
                          focusedErrorBorder: const OutlineInputBorder(
                              borderSide: BorderSide(color: kRed, width: .5)),
                        ),
                      ),
                    ),
                    const SizedBox(height: 10),
                    const SectionHeading(
                        title: 'Payment Method', showButton: false),
                    Padding(
                      padding: const EdgeInsets.only(right: 30.0, left: 30, top: 10),
                      child: Obx(() => Container(
                            decoration: BoxDecoration(
                                color: Colors.white,
                                border: Border.all(color: kLightWhite),
                                borderRadius: BorderRadius.circular(12)),
                            child: Column(
                              children: [
                                RadioListTile<String>(
                                  title: ReusableText(
                                    text: 'Cash on Delivery',
                                    style: appStyle(
                                        14, kDarkBlue, FontWeight.w400),
                                  ),
                                  value: 'Cash on Delivery',
                                  groupValue: selectedPaymentMethod.value,
                                  onChanged: (value) =>
                                      selectedPaymentMethod.value = value!,
                                  activeColor: KblueOcean,
                                ),
                                RadioListTile<String>(
                                  title: ReusableText(
                                    text: 'Visa / Credit Card',
                                    style: appStyle(
                                        14, kDarkBlue, FontWeight.w400),
                                  ),
                                  value: 'Visa',
                                  groupValue: selectedPaymentMethod.value,
                                  onChanged: (value) =>
                                      selectedPaymentMethod.value = value!,
                                  activeColor: KblueOcean,
                                ),
                              ],
                            ),
                          )),
                    ),
                    Obx(() {
                      final couponDiscount =
                          couponController.appliedDiscount.value.toDouble();
                      final totalAfterCoupon =
                          totalBeforeCoupon * (1 - (couponDiscount / 100));

                      return Padding(
                        padding: EdgeInsets.only(
                            right: 20.w, left: 20.w, bottom: 45.h, top: 20.w),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const SizedBox(height: 16),
                            _buildPriceRow('Subtotal :',
                                'EGP ${subtotal.toStringAsFixed(2)}'),
                            _buildPriceRow('Shipping Fee :',
                                'EGP ${shippingFee.toStringAsFixed(2)}'),
                            _buildPriceRow('Discount :',
                                '-EGP ${discount.toStringAsFixed(2)}'),
                            if (couponDiscount > 0)
                              _buildPriceRow('Coupon :',
                                  '-${couponDiscount.toStringAsFixed(0)}%'),
                            const Divider(height: 25, thickness: 1),
                            _buildPriceRow('Total :',
                                'EGP${totalAfterCoupon.toStringAsFixed(2)}',
                                bold: true),
                            const SizedBox(height: 12),
                            CustomButton(
                              onTap: () async {
                                final couponCode =
                                    couponController.appliedCoupon.value?.code;
                                final shippingAddress =
                                    addressController.text.trim();
                                final paymentMethod =
                                    selectedPaymentMethod.value;

                                if (shippingAddress.isEmpty) {
                                  Get.snackbar("Error",
                                      "Please enter a shipping address",
                                      backgroundColor: Colors.red,
                                      colorText: Colors.white);
                                  return;
                                }

                                if (paymentMethod == 'Visa') {
                                  final orderId =
                                      await orderController.placeOrder(
                                    cartItems: enrichedCartItems,
                                    shippingAddress: shippingAddress,
                                    shippingMethod: 'standard',
                                    couponCode: couponCode,
                                  );

                                  if (orderId != null) {
                                    final iframeUrl = await orderController
                                        .getPaymentIframeUrl(orderId);
                                    if (iframeUrl != null) {
                                      Get.to(() => PaymentWebViewScreen(
                                          iframeUrl: iframeUrl));
                                    } else {
                                      Get.snackbar("Payment Error",
                                          "Could not launch payment URL",
                                          backgroundColor: Colors.red,
                                          colorText: Colors.white);
                                    }
                                  }
                                } else {
                                  final orderId =
                                      await orderController.placeOrder(
                                    cartItems: enrichedCartItems,
                                    shippingAddress: shippingAddress,
                                    shippingMethod: 'standard',
                                    couponCode: couponCode,
                                  );

                                  if (orderId != null) {
                                    await cartController.clearCart();
                                    await cartController.refreshCartCount();
                                    Get.to(() => const SuccessOrderScreen());
                                  }
                                }
                              },
                              btnColor: kNavy,
                              text: 'Confirm Order',
                              textcolor: Colors.white,
                              btnWidth: double.infinity,
                              btnHeight: 55,
                            ),
                          ],
                        ),
                      );
                    }),
                  ],
                ),
              ),
      ),
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
}
