import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:graduation_project1/common/shimmers/categories_shimmer.dart';
import 'package:graduation_project1/hooks/fetch_categories.dart';
import 'package:graduation_project1/models/categories_model.dart';
import 'package:graduation_project1/views/categories/widgets/category_widget.dart';

class CategoryList extends HookWidget {
  const CategoryList({super.key});

  @override
  Widget build(BuildContext context) {
    final hookResult = useFetchCategories();
    final List<Category>? categories = hookResult.data;
    final isLoading = hookResult.isLoading;

    if (isLoading || categories == null) {
      return const CatergoriesShimmer();
    }

    return Container(
      padding: EdgeInsets.only(
        right: 4.w,
        left: 4.w,
      ),
      height: 100.h,
      child: ListView(
        scrollDirection: Axis.horizontal,
        children: List.generate(
          categories.length,
          (i) {
            return CategoryWidget(category: categories[i]);
          },
        ),
      ),
    );
  }
}
