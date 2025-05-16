import 'package:flutter/material.dart';
import 'package:graduation_project1/common/app_style.dart';
import 'package:graduation_project1/common/reusable_text.dart';
import 'package:graduation_project1/constants/constants.dart';
import 'package:graduation_project1/views/products/widgets/rating%20and%20reviews/OverallRating.dart';

class RatingSection extends StatelessWidget {
  const RatingSection({super.key, required this.reviewsNum, this.rate = 0.0});
  final int reviewsNum;
  final double rate;
  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(10),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(4),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          const Flexible(
            child: Padding(
              padding: EdgeInsets.only(right: 6.0),
              child: OverallRating(),
            ),
          ),
          Padding(
            padding: const EdgeInsets.only(right: 8.0),
            child: Column(
              children: [
                ReusableText(
                  text: '${rate.toStringAsFixed(1)}',
                  style: appStyle(40, KTextColor, FontWeight.w600),
                ),
                Row(
                  children: List.generate(5, (index) {
                    if (index < rate.floor()) {
                      return const Icon(Icons.star,
                          color: Colors.amber, size: 20);
                    } else if (index < rate && rate - index >= 0.5) {
                      return const Icon(Icons.star_half,
                          color: Colors.amber, size: 20);
                    } else {
                      return const Icon(Icons.star_border,
                          color: Colors.amber, size: 20);
                    }
                  }),
                ),
                ReusableText(
                  text: '${reviewsNum} Reviews',
                  style: appStyle(13, KTextColor, FontWeight.w400),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
