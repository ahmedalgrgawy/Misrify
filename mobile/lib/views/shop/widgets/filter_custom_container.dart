import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:get/get.dart';
import 'package:graduation_project1/common/app_style.dart';
import 'package:graduation_project1/common/reusable_text.dart';
import 'package:graduation_project1/constants/constants.dart';
import 'package:graduation_project1/controllers/filter_controller.dart';

class FilterCustomContainer extends StatelessWidget {
  final String label;
  final String type;

  FilterCustomContainer({super.key, required this.label, required this.type});

  final FilterController controller = Get.find();

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        if (type == 'brand') {
          controller.toggleBrand(label);
        } else if (type == 'category') {
          controller.toggleCategory(label);
        } else if (type == 'sizes') {
          controller.toggleSize(label);
        }
      },
      child: Obx(() {
        bool isSelected = false;
        if (type == 'brand') {
          isSelected = controller.selectedBrands.contains(label);
        } else if (type == 'category') {
          isSelected = controller.selectedCategories.contains(label);
        } else if (type == 'sizes') {
          isSelected = controller.selectedSizes.contains(label);
        }

        return AnimatedContainer(
          duration: const Duration(milliseconds: 250),
          padding: EdgeInsets.symmetric(horizontal: 10.w, vertical: 6.h),
          margin: EdgeInsets.only(right: 12.w),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(20.r),
            color: isSelected ? kDarkBlue : Colors.white,
            border: Border.all(color: kDarkBlue.withOpacity(0.3)),
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              ReusableText(
                text: label,
                style: appStyle(
                  14,
                  isSelected ? Colors.white : kDarkBlue,
                  FontWeight.w400,
                ),
              ),
              if (isSelected)
                Padding(
                  padding: EdgeInsets.only(left: 6.w),
                  child: InkWell(
                    onTap: () {
                      if (type == 'brand') {
                        controller.toggleBrand(label);
                      } else if (type == 'category') {
                        controller.toggleCategory(label);
                      } else if (type == 'sizes') {
                        controller.toggleSize(label);
                      }
                    },
                    borderRadius: BorderRadius.circular(12.r),
                    child: Container(
                      decoration: const BoxDecoration(
                        color: Colors.white,
                        shape: BoxShape.circle,
                      ),
                      child:
                          const Icon(Icons.close, size: 12, color: kDarkBlue),
                    ),
                  ),
                ),
            ],
          ),
        );
      }),
    );
  }
}
