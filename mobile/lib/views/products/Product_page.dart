import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';
import 'package:graduation_project1/common/app_style.dart';
import 'package:graduation_project1/common/custom_appbar.dart';
import 'package:graduation_project1/common/custom_button.dart';
import 'package:graduation_project1/common/reusable_text.dart';
import 'package:graduation_project1/constants/constants.dart';
import 'package:graduation_project1/controllers/cart_controller.dart';
import 'package:graduation_project1/controllers/reviews_controller.dart';
import 'package:graduation_project1/hooks/fetch_filterd_products.dart';
import 'package:graduation_project1/models/products_model.dart';
import 'package:graduation_project1/views/home/widgets/SectionHeading.dart';
import 'package:graduation_project1/views/products/related_items_screen.dart';
import 'package:graduation_project1/views/products/widgets/color_box.dart';
import 'package:graduation_project1/views/products/widgets/delivery_section.dart';
import 'package:graduation_project1/views/products/widgets/rating and reviews/review_container.dart';
import 'package:graduation_project1/views/products/widgets/rating and reviews/review_section.dart';
import 'package:graduation_project1/views/products/widgets/related_items.dart';
import 'package:graduation_project1/views/products/widgets/size_box.dart';

class ProductDetailScreen extends HookWidget {
  final Product product;

  const ProductDetailScreen({Key? key, required this.product}) : super(key: key);

  double get averageRating {
    if (product.reviews.isEmpty) return 0.0;
    final total = product.reviews.fold(0, (sum, r) => sum + r.rating);
    return total / product.reviews.length;
  }

  @override
  Widget build(BuildContext context) {
    final cartController = Get.find<CartController>();

    final reviewController = Get.put(ReviewController());
    final selectedColor = useState('');
    final selectedSize = useState('');
    final selectedIndex = useState(0);
    final originalPrice = product.price;
    final discountAmount = product.discountAmount;
    final discountedPrice =
        (originalPrice - discountAmount).clamp(0, originalPrice);

    final mainImage = useState<String>(
      'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?q=80&w=2069&auto=format&fit=crop',
    );

    useEffect(() {
      if (product.imgUrl != null && product.imgUrl!.startsWith('http')) {
        mainImage.value = product.imgUrl!;
      }
      return null;
    }, []);

// Replace with actual main image
    final reviewsKey = GlobalKey<ReviewsSectionState>();
    final hookResult = useFetchProductsByCategory(product.category.id);
    final selectedQuantity = useState<int>(1);

    final products = hookResult.data;
    final isLoading = hookResult.isLoading;
    final box = GetStorage();
    final userIdFromTokenOrStorage = box.read('userId') ?? "You";

    return Scaffold(
      appBar: CustomAppbar(
        title: 'Product Details',
        onpress: () {
          Get.back();
        },
      ),
      bottomNavigationBar: Padding(
        padding: EdgeInsets.symmetric(horizontal: 16.w, vertical: 12.h),
        child: CustomButton(
          onTap: () async {
            // ✅ Validate only if the product has sizes
            if (product.sizes.isNotEmpty && selectedSize.value.isEmpty) {
              Get.snackbar(
                'Missing Selection',
                'Please select a size before adding to cart.',
                colorText: Colors.black,
                backgroundColor: Colors.redAccent,
                icon: const Icon(Icons.warning, color: Colors.white),
              );
              return;
            }

            // ✅ Validate only if the product has colors
            if (product.colors.isNotEmpty && selectedColor.value.isEmpty) {
              Get.snackbar(
                'Missing Selection',
                'Please select a color before adding to cart.',
                colorText: Colors.black,
                backgroundColor: Colors.redAccent,
                icon: const Icon(Icons.warning, color: Colors.white),
              );
              return;
            }

            await cartController.addToCart(
              productId: product.id,
              quantity: selectedQuantity.value,
              color: product.colors.isEmpty ? null : selectedColor.value,
              size: product.sizes.isEmpty ? null : selectedSize.value,
            );
            await cartController.refreshCartCount();
          },
          btnColor: kLightBlue,
          text: 'Add To Cart',
          textcolor: Colors.white,
          btnWidth: double.infinity,
          btnHeight: 48,
        ),
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: EdgeInsets.all(16.w),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              //image
              SizedBox(
                height: 360,
                width: double.infinity,
                child: () {
                  final imgUrl = product.imgUrl;
                  if (imgUrl != null && imgUrl.startsWith('data:image')) {
                    try {
                      final base64Str = imgUrl.split(',').last;
                      return Image.memory(
                        base64Decode(base64Str),
                        fit: BoxFit.cover,
                        errorBuilder: (context, error, stackTrace) {
                          return const Icon(Icons.broken_image, size: 50);
                        },
                      );
                    } catch (_) {
                      return const Icon(Icons.broken_image, size: 50);
                    }
                  } else if (imgUrl != null && imgUrl.startsWith('http')) {
                    return Image.network(
                      imgUrl,
                      fit: BoxFit.cover,
                      errorBuilder: (context, error, stackTrace) {
                        return const Icon(Icons.broken_image, size: 50);
                      },
                    );
                  } else {
                    return Image.network(
                      'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?q=80&w=2069&auto=format&fit=crop',
                      fit: BoxFit.cover,
                      errorBuilder: (context, error, stackTrace) {
                        return const Icon(Icons.broken_image, size: 50);
                      },
                    );
                  }
                }(),
              ),

              const SizedBox(height: 20),
              ReusableText(
                  text: product.brand.name,
                  style: appStyle(12, kGray, FontWeight.w400)),
              const SizedBox(height: 4),
              ReusableText(
                  text: product.name,
                  style: appStyle(16, KTextColor, FontWeight.w600)),
              const SizedBox(height: 8),

// ✅ Rating, Reviews, Stock
              Row(
                children: [
                  // ⭐ Star Rating
                  Row(
                    children: List.generate(5, (index) {
                      if (index < averageRating.floor()) {
                        return const Icon(Icons.star,
                            color: Colors.amber, size: 18);
                      } else if (index < averageRating &&
                          averageRating - index >= 0.5) {
                        return const Icon(Icons.star_half,
                            color: Colors.amber, size: 18);
                      } else {
                        return const Icon(Icons.star_border,
                            color: Colors.amber, size: 18);
                      }
                    }),
                  ),
                  const SizedBox(width: 6),
                  Text(
                    averageRating.toStringAsFixed(1),
                    style: appStyle(13, KTextColor, FontWeight.w500),
                  ),
                  const SizedBox(width: 10),
                  Text(
                    '(${product.reviews.length} Reviews)',
                    style: appStyle(13, kGray, FontWeight.w400),
                  ),
                  const SizedBox(width: 10),
                  Text(
                    product.quantityInStock > 0 ? 'In Stock' : 'Out of Stock',
                    style: appStyle(
                      13,
                      product.quantityInStock > 0 ? Colors.green : Colors.red,
                      FontWeight.w500,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),

// ✅ Price Section
              product.isDiscounted && product.discountAmount > 0
                  ? Row(
                      children: [
                        ReusableText(
                          text:
                              "EGP ${(product.price - product.discountAmount).clamp(0, product.price).toStringAsFixed(2)}",
                          style: appStyle(22, kDarkBlue, FontWeight.w600),
                        ),
                        const SizedBox(width: 8),
                        Text(
                          "EGP ${product.price.toStringAsFixed(2)}",
                          style: appStyle(16, kGray, FontWeight.w400).copyWith(
                            decoration: TextDecoration.lineThrough,
                          ),
                        ),
                        const SizedBox(width: 8),
                        Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 6, vertical: 2),
                          decoration: BoxDecoration(
                            color: Colors.red[50],
                            borderRadius: BorderRadius.circular(4),
                          ),
                          child: Text(
                            "-${((product.discountAmount / product.price) * 100).round()}% OFF",
                            style: appStyle(12, Colors.red, FontWeight.w600),
                          ),
                        ),
                      ],
                    )
                  : ReusableText(
                      text: "EGP ${product.price.toStringAsFixed(2)}",
                      style: appStyle(20, KTextColor, FontWeight.w700),
                    ),

              const SizedBox(height: 8),
              if (product.sizes.isNotEmpty) ...[
                ReusableText(
                    text: 'Size',
                    style: appStyle(16, KTextColor, FontWeight.w500)),
                const SizedBox(height: 8),
                Wrap(
                  spacing: 8,
                  children: product.sizes.map((size) {
                    return SizeBox(
                      size: size,
                      selectedSize: selectedSize.value,
                      onTap: () => selectedSize.value = size,
                    );
                  }).toList(),
                ),
              ],
              if (product.colors.isNotEmpty) ...[
                const SizedBox(height: 10),
                ReusableText(
                    text: 'Colors',
                    style: appStyle(16, KTextColor, FontWeight.w500)),
                const SizedBox(height: 8),
                Wrap(
                  spacing: 8,
                  children: product.colors.map((colorName) {
                    return ColorBox(
                      colorName: colorName,
                      selectedColor: selectedColor.value,
                      onTap: () => selectedColor.value = colorName,
                    );
                  }).toList(),
                ),
              ],
              const SizedBox(height: 6),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  ReusableText(
                    text: 'Quantity',
                    style: appStyle(16, KTextColor, FontWeight.w500),
                  ),
                  Row(
                    children: [
                      RawMaterialButton(
                        onPressed: () {
                          if (selectedQuantity.value > 1) {
                            selectedQuantity.value -= 1;
                          }
                        },
                        fillColor: Colors.white,
                        shape: const CircleBorder(),
                        constraints:
                            BoxConstraints.tightFor(width: 32.w, height: 32.h),
                        elevation: 1,
                        child: const Icon(Icons.remove,
                            size: 20, color: Kfoundation),
                      ),
                      SizedBox(width: 8.w),
                      ReusableText(
                        text: selectedQuantity.value.toString(),
                        style: appStyle(16, KTextColor, FontWeight.w600),
                      ),
                      SizedBox(width: 8.w),
                      RawMaterialButton(
                        onPressed: () {
                          selectedQuantity.value += 1;
                        },
                        fillColor: Colors.white,
                        shape: const CircleBorder(),
                        constraints:
                            BoxConstraints.tightFor(width: 32.w, height: 32.h),
                        elevation: 1,
                        child:
                            const Icon(Icons.add, size: 20, color: Kfoundation),
                      ),
                    ],
                  ),
                ],
              ),
              const SizedBox(height: 10),
              ReusableText(
                  text: 'Description',
                  style: appStyle(14, KTextColor, FontWeight.w600)),
              const SizedBox(height: 8),
              ReusableText(
                  text: product.description,
                  style: appStyle(14, kGray, FontWeight.w400),
                  maxlines: 3),
              const SizedBox(height: 24),
              const DeliverySection(),
              const SizedBox(height: 15),
              ReviewInputContainer(
                productId: product.id,
                onReviewSubmitted: (review) {
                  final updatedReview =
                      review.copyWith(user: userIdFromTokenOrStorage);
                  reviewsKey.currentState?.addNewReview(updatedReview);
                  product.reviews.insert(0, updatedReview);
                },
              ),
              const SizedBox(height: 20),
              ReviewsSection(
                key: reviewsKey,
                productid: product.id,
                reviews: product.reviews,
                currentUserId: userIdFromTokenOrStorage,
                onDelete: (review) async {
                  await reviewController.deleteReview(review.id);
                  reviewsKey.currentState?.removeReview(review);
                  product.reviews.removeWhere((r) => r.id == review.id);
                },
              ),
              if (!isLoading &&
                  products != null &&
                  products!.where((p) => p.id != product.id).isNotEmpty) ...[
                Padding(
                  padding: EdgeInsets.only(bottom: 12.h),
                  child: SectionHeading(
                    title: 'Related Items',
                    padd: EdgeInsets.zero,
                    onPress: () => Get.to(() =>
                        RelatedItemsScreen(categoryId: product.category.id)),
                  ),
                ),
                RelatedItems(
                    products:
                        products!.where((p) => p.id != product.id).toList()),
              ] else if (isLoading)
                const Center(child: CircularProgressIndicator()),
            ],
          ),
        ),
      ),
    );
  }
}
