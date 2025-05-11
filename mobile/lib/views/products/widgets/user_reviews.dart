import 'package:flutter/material.dart';
import 'package:graduation_project1/constants/constants.dart';

class UserReviews extends StatelessWidget {
  const UserReviews({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(width: 8),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'Courtney Henry',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      Icon(Icons.more_vert, size: 20, color: Colors.black),
                    ],
                  ),
                  Row(
                    children: [
                      Row(
                        children: List.generate(5, (
                          index,
                        ) {
                          return Icon(
                            index < 4 ? Icons.star : Icons.star_border,
                            size: 16,
                            color: Colors.yellow[700],
                          );
                        }),
                      ),
                      const SizedBox(width: 8),
                      const Text(
                        '2 mins ago',
                        style: TextStyle(
                          fontSize: 12,
                          color: Colors.black,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 4),
                  const Text(
                    'Consequat velit qui adipiscing sunt do reprehenderit ad laborum tempor ullamco exercitation. Ullamco tempor adipiscing et voluptate duis sit esse aliqua',
                    style: TextStyle(
                      fontSize: 14,
                      color: Colors.black87,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
        const Padding(
          padding: EdgeInsets.symmetric(vertical: 8),
          child: Divider(
            color: kLightGray,
            thickness: 1,
          ),
        ),
      ],
    );
  }
}
