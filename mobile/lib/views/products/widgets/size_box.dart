import 'package:flutter/material.dart';
import 'package:graduation_project1/constants/constants.dart';

class SizeBox extends StatelessWidget {
  final String size;
  final String selectedSize;
  final VoidCallback onTap;

  const SizeBox({
    Key? key,
    required this.size,
    required this.selectedSize,
    required this.onTap,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final isSelected = selectedSize == size;

    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 36,
        height: 36,
        decoration: BoxDecoration(
          color: isSelected ? kDarkBlue : Colors.white,
          border: Border.all(color: isSelected ? Colors.black : Colors.grey),
          borderRadius: BorderRadius.circular(4),
        ),
        child: Center(
          child: Text(
            size,
            style: TextStyle(
              color: isSelected ? Colors.white : kDarkBlue,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
      ),
    );
  }
}
