// ignore_for_file: prefer_final_fields

import 'package:get/get.dart';

class BrandController extends GetxController {
  RxString _brand = ''.obs;
  String get brandValue => _brand.value;
  set updateBrand(String value) {
    _brand.value = value;
  }

  RxString _title = ''.obs;

  String get titleValue => _title.value;
  set updateTitle(String value) {
    _title.value = value;
  }
}
