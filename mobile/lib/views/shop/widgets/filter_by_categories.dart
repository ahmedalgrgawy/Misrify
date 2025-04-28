import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:graduation_project1/common/shimmers/filter_shimmer.dart';
import 'package:graduation_project1/hooks/fetch_categories.dart';
import 'package:graduation_project1/models/categories_model.dart';
import 'package:graduation_project1/views/shop/widgets/filter_category_widget.dart';

class FilterCategories extends HookWidget {
  const FilterCategories({super.key});

  @override
  Widget build(BuildContext context) {
    final hookResult = useFetchCategories();
    final List<Category>? categories = hookResult.data;
    final isLoading = hookResult.isLoading;

    if (isLoading || categories == null) {
      return const FilterShimmer();
    }

    return SizedBox(
      height: 50.h,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        itemCount: categories.length,
        separatorBuilder: (_, __) => SizedBox(width: 3.w),
        itemBuilder: (context, index) {
          return FilterCategoryWidget(category: categories[index]);
        },
      ),
    );
  }
}
