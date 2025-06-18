import 'package:get/get.dart';
import 'package:flutter/foundation.dart';

class FilterController extends GetxController {
  RxList<String> selectedBrands = <String>[].obs;
  RxList<String> selectedCategories = <String>[].obs;
  RxList<String> selectedSizes = <String>[].obs;

  void toggleBrand(String brand) {
    if (selectedBrands.contains(brand)) {
      selectedBrands.remove(brand);
      debugPrint('Brand deselected: \$brand');
    } else {
      selectedBrands.add(brand);
      debugPrint('Brand selected: \$brand');
    }
  }

  void toggleCategory(String category) {
    if (selectedCategories.contains(category)) {
      selectedCategories.remove(category);
      debugPrint('Category deselected: \$category');
    } else {
      selectedCategories.add(category);
      debugPrint('Category selected: \$category');
    }
  }

  void toggleSize(String size) {
    if (selectedSizes.contains(size)) {
      selectedSizes.remove(size);
      debugPrint('Size deselected: \$size');
    } else {
      selectedSizes.add(size);
      debugPrint('Size selected: \$size');
    }
  }

  void clearAll() {
    selectedBrands.clear();
    selectedCategories.clear();
    selectedSizes.clear();
    debugPrint('All filters cleared');
  }
}
