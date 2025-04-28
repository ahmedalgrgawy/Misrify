import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:graduation_project1/common/shimmers/filter_shimmer.dart';
import 'package:graduation_project1/hooks/fetch_all_products.dart';
import 'package:graduation_project1/models/products_model.dart';
import 'package:graduation_project1/views/shop/widgets/filter_size_widget.dart';

class FilterBySize extends HookWidget {
  const FilterBySize({super.key});

  @override
  Widget build(BuildContext context) {
    final hookResult = useFetchAllProducts();
    final List<Product>? products = hookResult.data;
    final isLoading = hookResult.isLoading;

    if (isLoading || products == null) {
      return const FilterShimmer();
    }

    final allSizes = <String>{};
    for (final product in products) {
      allSizes.addAll(product.sizes);
    }
    final sizeList = allSizes.toList();

    const order = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
    sizeList.sort((a, b) => order.indexOf(a).compareTo(order.indexOf(b)));

    return Container(
      padding: EdgeInsets.symmetric(horizontal: 4.w),
      height: 60.h,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        itemCount: sizeList.length,
        itemBuilder: (context, i) {
          return FilterSizeWidget(size: sizeList[i]);
        },
      ),
    );
  }
}
