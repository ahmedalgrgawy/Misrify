import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:get/get.dart';
import 'package:graduation_project1/views/products/Product_page.dart';
import 'package:graduation_project1/views/products/widgets/product_widget.dart';
import 'package:graduation_project1/models/products_model.dart';

class AllProductsList extends StatelessWidget {
  final List<Product> products;
  const AllProductsList({super.key, required this.products});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.symmetric(horizontal: 8.w, vertical: 10.w),
      child: GridView.builder(
        shrinkWrap: true,
        physics: const NeverScrollableScrollPhysics(),
        itemCount: products.length,
        gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 2,
          mainAxisSpacing: 15.h,
          mainAxisExtent: 260.h,
        ),
        itemBuilder: (context, index) {
          final product = products[index];
          return ProductWidget(
            onTap: () {
              Get.to(() => ProductDetailScreen(product: product));
            },
            brand: product.brand.name,
            price: product.price.toStringAsFixed(2),
            title: product.name,
            id: product.id,
          );
        },
      ),
    );
  }
}
