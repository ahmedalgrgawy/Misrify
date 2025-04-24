// ignore_for_file: must_be_immutable

import 'package:flutter/material.dart';
import 'package:graduation_project1/views/shop/widgets/filter_custom_container.dart';

class FilterSizeWidget extends StatelessWidget {
  FilterSizeWidget({super.key, required this.size});
  final String size;

  @override
  Widget build(BuildContext context) {
    return FilterCustomContainer(
      label: size,
      type: 'sizes',
    );
  }
}
