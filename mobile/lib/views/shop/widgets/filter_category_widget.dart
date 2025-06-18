// ignore_for_file: must_be_immutable

import 'package:flutter/material.dart';
import 'package:graduation_project1/views/shop/widgets/filter_custom_container.dart';

class FilterCategoryWidget extends StatelessWidget {
  FilterCategoryWidget({super.key, required this.category});
  var category;
  @override
  Widget build(BuildContext context) {
    return FilterCustomContainer(label: category.name, type: 'category');
  }
}
