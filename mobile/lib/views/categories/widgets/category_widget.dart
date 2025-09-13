import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:get/get.dart';
import 'package:graduation_project1/common/app_style.dart';
import 'package:graduation_project1/common/reusable_text.dart';
import 'package:graduation_project1/constants/constants.dart';
import 'package:graduation_project1/controllers/category_controller.dart';
import 'package:graduation_project1/models/categories_model.dart';
import 'package:graduation_project1/views/categories/all_category_product_screen.dart';

// ignore: must_be_immutable
class CategoryWidget extends StatelessWidget {
  CategoryWidget({super.key, required this.category});

  Category category;

  @override
  Widget build(BuildContext context) {
    final controller = Get.put(CategoryController());

    Widget buildImage(String? imgUrl) {
      if (imgUrl != null && imgUrl.startsWith('data:image')) {
        try {
          final base64Str = imgUrl.split(',').last;
          return Image.memory(
            base64Decode(base64Str),
            fit: BoxFit.cover,
            errorBuilder: (_, __, ___) =>
                const Icon(Icons.broken_image, size: 40),
          );
        } catch (_) {
          return const Icon(Icons.broken_image, size: 40);
        }
      } else if (imgUrl != null && imgUrl.startsWith('http')) {
        return Image.network(
          imgUrl,
          fit: BoxFit.cover,
          errorBuilder: (_, __, ___) =>
              const Icon(Icons.broken_image, size: 40),
        );
      } else {
        return Image.network(
          "https://static.vecteezy.com/system/resources/previews/035/438/654/non_2x/ai-generated-blue-hoodie-isolated-on-transparent-background-free-png.png",
          fit: BoxFit.contain,
          errorBuilder: (_, __, ___) =>
              const Icon(Icons.broken_image, size: 40),
        );
      }
    }

    return GestureDetector(
      onTap: () {
        if (controller.categoryIdValue == category.id) {
          controller.updateCategoryId = '';
          controller.updateTitle = '';
        } else {
          controller.updateCategoryId = category.id;
          controller.updateTitle = category.name;
          Get.to(() => const AllCategoryProductScreen());
        }
      },
      child: Obx(
        () => Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Container(
              margin: EdgeInsets.symmetric(horizontal: 10.w),
              width: width * 0.19,
              height: 60.h,
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(10.r),
                border: Border.all(
                  color: controller.categoryIdValue == category.id
                      ? kNavy
                      : Colors.white,
                  width: .5.w,
                ),
              ),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(10.r),
                child: buildImage(category.imgUrl),
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
