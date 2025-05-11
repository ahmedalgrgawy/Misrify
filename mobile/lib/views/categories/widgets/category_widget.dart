// ignore_for_file: must_be_immutable

import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:get/get.dart';
import 'package:graduation_project1/common/app_style.dart';
import 'package:graduation_project1/common/reusable_text.dart';
import 'package:graduation_project1/constants/constants.dart';
import 'package:graduation_project1/controllers/category_controller.dart';
import 'package:graduation_project1/models/categories_model.dart';
import 'package:graduation_project1/views/categories/all_category_product_screen.dart';

class CategoryWidget extends StatelessWidget {
  CategoryWidget({
    super.key,
    required this.category,
  });

  Category category;

  @override
  Widget build(BuildContext context) {
    final controller = Get.put(CategoryController());
    return GestureDetector(
      onTap: () {
        if (controller.categoryValue == category.id) {
          controller.updateCategory = '';
          controller.updateTitle = '';
        } else {
          controller.updateCategory = category.id;
          controller.updateTitle = category.name;

          // Navigate to category product screen
          Get.to(() => const AllCategoryProductScreen());
        }
      },
      child: Obx(
        () => Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Container(
              margin: EdgeInsets.symmetric(
                horizontal: 10.w,
              ),
              width: width * 0.19,
              decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(10.r),
                  border: Border.all(
                      color: controller.categoryValue == category
                          ? kNavy
                          : Colors.white,
                      width: .5.w)),
              child: SizedBox(
                height: 60.h,
                child: Image.network(
                  "https://static.vecteezy.com/system/resources/previews/035/438/654/non_2x/ai-generated-blue-hoodie-isolated-on-transparent-background-free-png.png",
                  fit: BoxFit.contain,
                ),
              ),
            ),
            Padding(
              padding: EdgeInsets.only(top: 5.h),
              child: ReusableText(
                text: category.name,
                style: appStyle(14, KNavyBlack, FontWeight.w400),
              ),
            )
          ],
        ),
      ),
    );
  }
}
