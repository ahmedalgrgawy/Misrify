import 'dart:convert';
import 'package:get/get.dart';
import 'package:http/http.dart' as http;
import 'package:graduation_project1/constants/constants.dart';
import 'package:graduation_project1/models/products_model.dart';

class ProductsController extends GetxController {
  RxInt currentPage = 0.obs;
  RxInt count = 1.obs;
  RxDouble _totalPrice = 0.0.obs;

  double get additivePrice => _totalPrice.value;

  bool initialCheckValue = false;

  void changePage(int index) {
    currentPage.value = index;
  }

  void increment() {
    count.value++;
  }

  void decrement() {
    if (count.value > 1) {
      count.value--;
    }
  }

  set setTotalPrice(double newPrice) {
    _totalPrice.value = newPrice;
  }

  double getTotalPrice() {
    double totalPrice = 0.0;
    // Add logic for computing price if needed
    setTotalPrice = totalPrice;
    return totalPrice;
  }

  // ✅ Fetch single product by ID from backend
  Future<Product> fetchSingleProduct(String productId) async {
    final url = Uri.parse('$appBaseUrl/user/products/$productId');

    final response = await http.get(url);

    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      return Product.fromJson(data['product']); // Adjust if needed
    } else {
      throw Exception('Failed to load product');
    }
  }
}
