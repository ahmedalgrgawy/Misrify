import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:flutter_vector_icons/flutter_vector_icons.dart';
import 'package:get/get.dart';
import 'package:graduation_project1/common/app_style.dart';
import 'package:graduation_project1/constants/constants.dart';
import 'package:graduation_project1/views/search/search_screen.dart';

class SearchContainer extends StatelessWidget {
  const SearchContainer(
      {super.key,
      required this.controller,
      this.margin = const EdgeInsets.only(top: 30, right: 30, left: 30)});

  final TextEditingController controller;
  final EdgeInsetsGeometry? margin;
  @override
  Widget build(BuildContext context) {
    return Container(
        margin: margin,
        decoration: BoxDecoration(
          color: Colors.white,
          border: Border.all(color: Colors.white, width: 0.4),
          borderRadius: BorderRadius.circular(10.r),
        ),
        child: TextFormField(
          style: appStyle(14, kBlue, FontWeight.w400),
          cursorHeight: 20.h,
          controller: controller,
          onFieldSubmitted: (query) {
            if (query.trim().isNotEmpty) {
              Get.to(() => SearchScreen(initialSearch: query.trim()));
              controller.clear();
            }
          },
          decoration: InputDecoration(
            border: InputBorder.none,
            hintText: "Search",
            hintStyle: appStyle(17, kLightGray, FontWeight.w400),
            prefixIcon: const Icon(
              Ionicons.search,
              size: 27,
              color: kNavy,
            ),
          ),
        ));
  }
}
