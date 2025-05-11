import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:graduation_project1/common/shimmers/shimmer_widget.dart';

class FilterShimmer extends StatelessWidget {
  const FilterShimmer({super.key});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 42.h, // slightly reduced to prevent overflow
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        padding: EdgeInsets.only(left: 12.w, right: 12.w),
        itemCount: 6,
        itemBuilder: (context, index) {
          return Padding(
            padding: EdgeInsets.only(right: 8.w),
            child: ShimmerWidget(
              shimmerWidth: 70.w,
              shimmerHieght: 30.h,
              shimmerRadius: 12,
            ),
          );
        },
      ),
    );
  }
}
