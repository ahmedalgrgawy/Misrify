// ignore_for_file: prefer_final_fields

import 'package:get/get.dart';

class CategoryController extends GetxController {
  // Category ID
  RxString _categoryId = ''.obs;
  String get categoryIdValue => _categoryId.value;
  set updateCategoryId(String value) {
    _categoryId.value = value;
  }

  // Category name
  RxString _title = ''.obs;
  String get titleValue => _title.value;
  set updateTitle(String value) {
    _title.value = value;
  }
}
