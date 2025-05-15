import 'package:flutter/material.dart';
import 'package:graduation_project1/constants/constants.dart';

import 'RatingProgress.dart';

class OverallRating extends StatelessWidget {
  const OverallRating({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        RatingProgress(text: '5', value: 1),
        RatingProgress(text: '4', value: .8),
        RatingProgress(text: '3', value: .6),
        RatingProgress(text: '2', value: .4),
        RatingProgress(text: '1 ', value: .2),
      ],
    );
  }
}
