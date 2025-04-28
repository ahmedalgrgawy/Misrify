import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:get/get.dart';
import 'package:graduation_project1/common/GrideLayout.dart';
import 'package:graduation_project1/common/shimmers/nearby_shimmer.dart';
import 'package:graduation_project1/hooks/fetch_all_products.dart';
import 'package:graduation_project1/views/products/Product_page.dart';
import 'package:graduation_project1/views/products/widgets/product_widget.dart';

class ProductList extends HookWidget {
  const ProductList({super.key, this.isAll = false});
  final bool isAll;

  @override
  Widget build(BuildContext context) {
    final hookResult = useFetchAllProducts();
    final products = hookResult.data;
    final isLoading = hookResult.isLoading;

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 4),
      height: 260.h,
      child: isLoading
          ? const NearbyShimmer()
          : GrideLayout(
              crossAxisspacing: 20,
              scrooldirection: Axis.horizontal,
              itemCount: products.length < 4 ? products.length : 4,
              itemBuilder: (context, i) {
                final product = products[i];
                return ProductWidget(
                  onTap: () {
                    Get.to(() => ProductPage(
                        //   product: product
                        ));
                  },
                  brand: product.brand.name,
                  price: product.price.toStringAsFixed(2),
                  title: product.name,

                  // image: product.colors.isNotEmpty
                  //     ? product.colors.first
                  //     : 'https://via.placeholder.com/150',
                );
              },
            ),
    );
  }
}
