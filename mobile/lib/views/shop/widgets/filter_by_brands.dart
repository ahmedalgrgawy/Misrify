import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:graduation_project1/common/shimmers/filter_shimmer.dart';
import 'package:graduation_project1/hooks/fetch_all_brands.dart';
import 'package:graduation_project1/models/brands_model.dart';
import 'package:graduation_project1/views/shop/widgets/filter_brand_widget.dart';

class FilterByBrands extends HookWidget {
  const FilterByBrands({super.key});

  @override
  Widget build(BuildContext context) {
    final hookResult = useFetchBrands();
    final List<Brand>? brands = hookResult.data;
    final isLoading = hookResult.isLoading;

    if (isLoading || brands == null) {
      return const FilterShimmer();
    }

    return SizedBox(
      height: 50.h,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        itemCount: brands.length,
        separatorBuilder: (_, __) => SizedBox(width: 6.w),
        itemBuilder: (context, index) {
          return FilterBrandWidget(brand: brands[index]);
        },
      ),
    );
  }
}
