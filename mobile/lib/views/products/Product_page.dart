import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:get/get.dart';
import 'package:graduation_project1/common/app_style.dart';
import 'package:graduation_project1/common/reusable_text.dart';
import 'package:graduation_project1/constants/constants.dart';
import 'package:graduation_project1/constants/uidata.dart';
import 'package:graduation_project1/hooks/fetch_all_products.dart';
import 'package:graduation_project1/views/products/widgets/delivery_section.dart';
import 'package:graduation_project1/views/products/widgets/rating/rating_section.dart';
import 'package:graduation_project1/views/products/widgets/related_items.dart';
import 'package:graduation_project1/views/products/widgets/user_reviews.dart';

class ProductDetailScreen extends HookWidget {
  ProductDetailScreen({Key? key}) : super(key: key);
  static const String routeName = "Home_Screen";

  @override
  Widget build(BuildContext context) {
    final hookResult = useFetchAllProducts();
    final products = hookResult.data;
    final isLoading = hookResult.isLoading;

    final selectedSize = useState('');
    final selectedIndex = useState(0);
    final isFavorite = useState(false);
    final mainImage = useState(
      'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?q=80&w=2069&auto=format&fit=crop',
    );

    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Get.back(),
        ),
        title: Center(
          child: ReusableText(
            text: 'Product Details',
            style: appStyle(14, KTextColor, FontWeight.bold),
          ),
        ),
        actions: [
          IconButton(
            icon: Icon(Icons.favorite,
                color: isFavorite.value ? Colors.red : null),
            onPressed: () => isFavorite.value = !isFavorite.value,
          ),
        ],
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Main Image
            SizedBox(
              height: 300,
              width: double.infinity,
              child: Image.network(mainImage.value, fit: BoxFit.cover),
            ),
            const SizedBox(height: 20),

            // Thumbnails
            SizedBox(
              height: 100,
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                itemCount: productimage.length,
                itemBuilder: (context, index) {
                  return GestureDetector(
                    onTap: () {
                      mainImage.value = productimage[index];
                      selectedIndex.value = index;
                    },
                    child: Padding(
                      padding: const EdgeInsets.all(8.0),
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(8),
                        child: Image.network(
                          productimage[index],
                          fit: BoxFit.cover,
                          width: 80,
                        ),
                      ),
                    ),
                  );
                },
              ),
            ),

            // Product Info
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  ReusableText(
                    text: 'Calvin Klein',
                    style: appStyle(16, kGray, FontWeight.w500),
                  ),
                  const SizedBox(height: 4),
                  ReusableText(
                    text: 'Premium White T-Shirt with OUTFIT Logo',
                    style: appStyle(16, KTextColor, FontWeight.w500),
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      Row(
                        children: List.generate(5, (index) {
                          return Icon(
                            CupertinoIcons.star_fill,
                            size: 18,
                            color: index < 4 ? Colors.amber : kLightGray,
                          );
                        }),
                      ),
                      const SizedBox(width: 4),
                      ReusableText(
                        text: '(150 Reviews)',
                        style: appStyle(12, kGray, FontWeight.w400),
                      ),
                      const SizedBox(width: 8),
                      Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 8, vertical: 2),
                        decoration: BoxDecoration(
                          color: Colors.green[50],
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: ReusableText(
                          text: 'In stock',
                          style: appStyle(12, Colors.green, FontWeight.w400),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  ReusableText(
                    text: '\$99.00',
                    style: appStyle(24, KTextColor, FontWeight.w500),
                  ),
                  const SizedBox(height: 16),
                  ReusableText(
                    text: 'Size',
                    style: appStyle(16, KTextColor, FontWeight.w500),
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: ['S', 'M', 'L', 'XL', 'XXL'].map((size) {
                      return GestureDetector(
                        onTap: () => selectedSize.value = size,
                        child: Container(
                          width: 36,
                          height: 36,
                          margin: const EdgeInsets.only(right: 8),
                          decoration: BoxDecoration(
                            color: selectedSize.value == size
                                ? Colors.black
                                : Colors.transparent,
                            border: Border.all(
                              color: selectedSize.value == size
                                  ? Colors.black
                                  : Colors.grey,
                            ),
                            borderRadius: BorderRadius.circular(4),
                          ),
                          child: Center(
                            child: Text(
                              size,
                              style: TextStyle(
                                color: selectedSize.value == size
                                    ? Colors.white
                                    : Colors.black,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                        ),
                      );
                    }).toList(),
                  ),
                  const SizedBox(height: 16),
                  ReusableText(
                    text: 'Description',
                    style: appStyle(14, KTextColor, FontWeight.w600),
                  ),
                  const SizedBox(height: 8),
                  ReusableText(
                    text:
                        'Premium quality cotton t-shirt with embroidered logo. Comfortable fit and durable material. Perfect for everyday wear.',
                    style: appStyle(14, kGray, FontWeight.w400),
                    maxlines: 3,
                  ),
                  const SizedBox(height: 24),
                  SizedBox(
                    width: double.infinity,
                    height: 50,
                    child: ElevatedButton(
                      onPressed: () {},
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.indigo[900],
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                      ),
                      child: const Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text(
                            'Add to cart',
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          SizedBox(width: 8),
                          Icon(Icons.arrow_forward),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 24),
                  DeliverySection(),
                  const SizedBox(height: 24),
                  ReusableText(
                    text: 'Product Ratings and Reviews',
                    style: appStyle(14, KTextColor, FontWeight.w600),
                  ),
                  const SizedBox(height: 10),
                  RatingSection(),
                  const SizedBox(height: 16),
                  const Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [UserReviews(), UserReviews(), UserReviews()],
                  ),
                  Padding(
                    padding: EdgeInsets.only(bottom: 12.h),
                    child: ReusableText(
                      text: 'Related Item',
                      style: appStyle(20, KTextColor, FontWeight.w600),
                    ),
                  ),
                  if (isLoading || products == null)
                    const CircularProgressIndicator()
                  else
                    RelatedItems(products: products!)
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
