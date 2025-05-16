import 'package:flutter/material.dart';
import 'package:graduation_project1/constants/constants.dart';

class ColorBox extends StatelessWidget {
  final String colorName;
  final String selectedColor;
  final VoidCallback onTap;

  const ColorBox({
    Key? key,
    required this.colorName,
    required this.selectedColor,
    required this.onTap,
  }) : super(key: key);

  /// Convert color name to Color object
  Color _parseColor(String name) {
    switch (name.toLowerCase()) {
      case 'red':
        return Colors.red;
      case 'blue':
        return Colors.blue;
      case 'green':
        return Colors.green;
      case 'black':
        return Colors.black;
      case 'white':
        return Colors.white;
      case 'orange':
        return Colors.orange;
      case 'purple':
        return Colors.purple;
      case 'pink':
        return Colors.pink;
      case 'yellow':
        return Colors.yellow;
      case 'teal':
        return Colors.teal;
      case 'grey':
      case 'gray':
        return Colors.grey;
      case 'navy':
        return const Color(0xFF000080);
      default:
        return kDarkBlue;
    }
  }

  @override
  Widget build(BuildContext context) {
    final isSelected = selectedColor == colorName;
    final color = _parseColor(colorName);

    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 30,
        height: 30,
        decoration: BoxDecoration(
          color: color,
          border: Border.all(
            color: isSelected ? Colors.white : Colors.transparent,
            width: isSelected ? 2 : 1,
          ),
          borderRadius: BorderRadius.circular(50),
        ),
        child: isSelected
            ? const Icon(Icons.check, color: Colors.white, size: 18)
            : null,
      ),
    );
  }
}
