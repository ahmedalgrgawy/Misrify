import 'package:flutter/material.dart';
import 'package:graduation_project1/common/app_style.dart';
import 'package:graduation_project1/constants/constants.dart';

class RatingProgress extends StatelessWidget {
  final String text;
  final double value;
  const RatingProgress({super.key, required this.text, required this.value});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 3),
      child: Row(
        children: [
          // Label and star
          SizedBox(
            width: 40,
            child: Row(
              children: [
                Text(text, style: appStyle(14, KTextColor, FontWeight.w400)),
                SizedBox(width: 3),
                Icon(Icons.star, size: 16, color: Colors.amber),
              ],
            ),
          ),

          // Progress bar
          Flexible(
            child: Padding(
              padding: const EdgeInsets.symmetric(vertical: 4),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(50),
                child: LinearProgressIndicator(
                  value: value,
                  minHeight: 11,
                  borderRadius: BorderRadius.circular(50),
                  backgroundColor: Colors.white,
                  valueColor: const AlwaysStoppedAnimation(KTextColor),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
