import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:graduation_project1/constants/constants.dart';
import 'package:graduation_project1/models/api_error_model.dart';
import 'package:graduation_project1/models/products_model.dart';
import 'package:http/http.dart' as http;

class SearchProductsController extends GetxController {
  final RxBool _isLoading = false.obs;
  bool get isLoading => _isLoading.value;
  set setLoading(bool value) {
    _isLoading.value = value;
  }

  final RxBool _isTriggerd = false.obs;
  bool get isTriggerd => _isTriggerd.value;
  set setTrigger(bool value) {
    _isTriggerd.value = value;
  }

  List<Product>? searcResults;

  void searchProduct(String query) async {
    setLoading = true;
    try {
      final response =
          await http.get(Uri.parse('$appBaseUrl/user/search?query=$query'));
      print(response.body);
      if (response.statusCode == 200) {
        final parsedModel = productsModelFromJson(response.body);
        searcResults = parsedModel.products ?? [];
      } else {
        searcResults = [];
      }
    } catch (e) {
      searcResults = [];
      debugPrint("Search error: $e");
    } finally {
      setLoading = false;
    }
  }
}
