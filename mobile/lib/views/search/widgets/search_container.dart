import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:flutter_vector_icons/flutter_vector_icons.dart';
import 'package:get/get.dart';
import 'package:graduation_project1/common/app_style.dart';
import 'package:graduation_project1/constants/constants.dart';
import 'package:graduation_project1/controllers/search_products_controller.dart';
import 'package:graduation_project1/views/search/search_screen.dart';

class SearchContainer extends StatelessWidget {
  const SearchContainer(
      {super.key,
      this.controller,
      this.onEditingComplete,
      this.obscureText,
      this.prefixIcon,
      this.validator,
      this.margin = const EdgeInsets.only(left: 30, right: 30, top: 30),
      this.maxlines});

  final TextEditingController? controller;
  final void Function()? onEditingComplete;
  final bool? obscureText;
  final Widget? prefixIcon;
  final String? Function(String?)? validator;
  final int? maxlines;
  final EdgeInsetsGeometry? margin;

  @override
  Widget build(BuildContext context) {
    final TextEditingController _searchController = TextEditingController();
    final controller = Get.put(SearchProductsController());

    return Container(
      margin: margin,
      decoration: BoxDecoration(
          color: Colors.white,
          border: Border.all(color: Colors.white, width: 0.4),
          borderRadius: BorderRadius.circular(10.r)),
      child: TextFormField(
        maxLines: maxlines ?? 1,
        controller: _searchController,
        keyboardType: TextInputType.text,
        onEditingComplete: onEditingComplete,
        obscureText: obscureText ?? false,
        cursorHeight: 20.h,
        style: appStyle(14, kBlue, FontWeight.w400),
        validator: validator,
        decoration: InputDecoration(
          border: InputBorder.none,
          hintText: "Search",
          hintStyle: appStyle(17, kLightGray, FontWeight.w400),
          prefixIcon: GestureDetector(
            onTap: () {
              Get.to(SearchScreen());
              if (controller.isTriggerd == false) {
                controller.searchProduct(_searchController.text);
                controller.setTrigger = true;
              } else {
                controller.searcResults = null;
                controller.setTrigger = false;
                _searchController.clear();
              }
            },
            child: controller.isTriggerd == false
                ? const Icon(
                    Ionicons.search_circle,
                    size: 30,
                    color: kDarkBlue,
                  )
                : const Icon(
                    Ionicons.close_circle,
                    size: 30,
                    color: kDarkBlue,
                  ),
          ),

          //  GestureDetector(

          //     child:
        ),
      ),
    );
  }
}
