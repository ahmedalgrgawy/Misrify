// ignore_for_file: must_be_immutable

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

class CategoryTile extends StatelessWidget {
  CategoryTile({
    super.key,
    required this.category,
  });

  Category category;

  Widget _buildImage(String? imgUrl) {
    if (imgUrl != null && imgUrl.startsWith('data:image')) {
      try {
        final base64Str = imgUrl.split(',').last;
        return Image.memory(
          base64Decode(base64Str),
          fit: BoxFit.cover,
          errorBuilder: (_, __, ___) => const Icon(Icons.broken_image),
        );
      } catch (_) {
        return const Icon(Icons.broken_image);
      }
    } else if (imgUrl != null && imgUrl.startsWith('http')) {
      return Image.network(
        imgUrl,
        fit: BoxFit.cover,
        errorBuilder: (_, __, ___) => const Icon(Icons.broken_image),
      );
    } else {
      return Image.network(
        "https://static.vecteezy.com/system/resources/previews/035/438/654/non_2x/ai-generated-blue-hoodie-isolated-on-transparent-background-free-png.png",
        fit: BoxFit.cover,
        errorBuilder: (_, __, ___) => const Icon(Icons.broken_image),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final controller = Get.put(CategoryController());

    return ListTile(
      onTap: () {
        controller.updateCategoryId = category.id; // ✅
        controller.updateTitle = category.name;
        Get.to(() => const AllCategoryProductScreen(),
            transition: Transition.fadeIn,
            duration: const Duration(milliseconds: 900));
      },
      leading: CircleAvatar(
        radius: 22.r,
        backgroundColor: Kbackground,
        child: ClipOval(
          child: _buildImage(category.imgUrl),
        ),
      ),
      title: ReusableText(
        text: category.name,
        style: appStyle(14, KTextColor, FontWeight.normal),
      ),
      trailing: Icon(
        Icons.arrow_forward_ios_rounded,
        size: 15.r,
        color: kGray,
      ),
    );
  }
}
