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
      case 'pink':
        return const Color.fromARGB(255, 237, 182, 182);
      case 'baby blue':
        return const Color.fromARGB(255, 136, 204, 238);
      case 'blue':
        return Colors.blue;
      case 'olive':
        return const Color.fromARGB(255, 47, 103, 49);
      case 'green':
        return Colors.green;
      case 'black':
        return Colors.black;
      case 'white':
        return Colors.white;
      case 'off white':
        return const Color.fromARGB(255, 224, 225, 211);
      case 'beige':
        return const Color.fromARGB(255, 230, 228, 207);
      case 'burgandy':
        return const Color.fromARGB(255, 84, 31, 31);
      case 'brown':
        return const Color.fromARGB(255, 67, 50, 6);
      case 'orange':
        return Colors.orange;
      case 'purple':
        return const Color.fromARGB(255, 211, 158, 222);
      case 'yellow':
        return const Color.fromARGB(255, 247, 236, 142);
      case 'teal':
        return Colors.teal;
      case 'grey':
      case 'gray':
        return Colors.grey;
      case 'navy':
        return const Color.fromARGB(255, 7, 7, 63);
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
