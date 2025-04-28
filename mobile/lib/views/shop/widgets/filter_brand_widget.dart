import 'package:flutter/material.dart';
import 'package:graduation_project1/models/brands_model.dart';
import 'package:graduation_project1/views/shop/widgets/filter_custom_container.dart';

class FilterBrandWidget extends StatelessWidget {
  final Brand brand;
  const FilterBrandWidget({super.key, required this.brand});

  @override
  Widget build(BuildContext context) {
    return FilterCustomContainer(label: brand.name, type: 'brand');
  }
}
