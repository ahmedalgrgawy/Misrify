// ignore_for_file: must_be_immutable, prefer_const_constructors_in_immutables

import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:graduation_project1/common/app_style.dart';
import 'package:graduation_project1/common/back_ground_container.dart';
import 'package:graduation_project1/common/reusable_text.dart';
import 'package:graduation_project1/common/shimmers/foodlist_shimmer.dart';
import 'package:graduation_project1/constants/constants.dart';
import 'package:graduation_project1/hooks/fetch_categories.dart';
import 'package:graduation_project1/models/categories_model.dart';
import 'package:graduation_project1/views/categories/widgets/category_tile.dart';

class CategoriesScreen extends HookWidget {
  CategoriesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final hookResult = useFetchCategories();
    List<Category>? categoriesList = hookResult.data;
    final isLoading = hookResult.isLoading;

    return Scaffold(
      appBar: AppBar(
        backgroundColor: Kbackground,
        title: ReusableText(
          text: 'Categories',
          style: appStyle(16, kDarkBlue, FontWeight.w500),
        ),
      ),
      body: BackGroundContainer(
        color: Colors.white,
        child: Container(
          padding: EdgeInsets.only(left: 12.w, top: 10.h),
          height: height,
          child: isLoading
              ? FoodsListShimmer()
              : ListView(
                  scrollDirection: Axis.vertical,
                  children: List.generate(categoriesList!.length, (i) {
                    Category category = categoriesList[i];
                    return CategoryTile(category: category);
                  }),
                ),
        ),
      ),
    );
  }
}
