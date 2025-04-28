import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:get/get.dart';
import 'package:graduation_project1/common/app_style.dart';
import 'package:graduation_project1/common/reusable_text.dart';
import 'package:graduation_project1/constants/constants.dart';
import 'package:graduation_project1/controllers/filter_controller.dart';
import 'package:graduation_project1/views/shop/widgets/filter_by_brands.dart';
import 'package:graduation_project1/views/shop/widgets/filter_by_size.dart';
import 'package:graduation_project1/views/shop/widgets/filter_by_categories.dart';

Future FilterBottomSheet(BuildContext context) {
  final filterController = Get.find<FilterController>();

  return showModalBottomSheet(
    context: context,
    isScrollControlled: true,
    backgroundColor: Kbackground,
    shape: const RoundedRectangleBorder(
      borderRadius: BorderRadius.vertical(top: Radius.circular(8)),
    ),
    builder: (context) {
      return DraggableScrollableSheet(
        expand: false,
        initialChildSize: 0.45,
        minChildSize: 0.4,
        maxChildSize: 0.7,
        builder: (context, scrollController) {
          return SingleChildScrollView(
            controller: scrollController,
            padding: EdgeInsets.symmetric(horizontal: 10.0.w, vertical: 7.h),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    TextButton(
                      onPressed: () {
                        filterController.clearAll();
                      },
                      child: ReusableText(
                        text: 'Clear all',
                        style: appStyle(14, kDarkBlue, FontWeight.w400),
                      ),
                    ),
                    ReusableText(
                      text: 'Filter',
                      style: appStyle(14, kDarkBlue, FontWeight.w400),
                    ),
                    RawMaterialButton(
                      onPressed: () => Get.back(),
                      fillColor: kDarkBlue,
                      shape: const CircleBorder(),
                      constraints:
                          BoxConstraints.tightFor(width: 24.w, height: 24.h),
                      child: const Icon(Icons.arrow_forward,
                          color: Colors.white, size: 16),
                    )
                  ],
                ),
                SizedBox(height: 10.h),
                ReusableText(
                    text: 'Categories',
                    style: appStyle(18, kDarkBlue, FontWeight.w400)),
                const SizedBox(height: 10),
                SizedBox(height: 40.h, child: const FilterCategories()),
                const SizedBox(height: 10),
                ReusableText(
                    text: 'Brand',
                    style: appStyle(18, kDarkBlue, FontWeight.w400)),
                const SizedBox(height: 10),
                SizedBox(height: 40.h, child: const FilterByBrands()),
                const SizedBox(height: 10),
                ReusableText(
                    text: 'Size',
                    style: appStyle(18, kDarkBlue, FontWeight.w400)),
                const SizedBox(height: 10),
                SizedBox(height: 40.h, child: const FilterBySize()),
                const SizedBox(height: 20),
              ],
            ),
          );
        },
      );
    },
  );
}
