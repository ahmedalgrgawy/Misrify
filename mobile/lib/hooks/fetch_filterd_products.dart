import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:graduation_project1/constants/constants.dart';
import 'package:graduation_project1/models/api_error_model.dart';
import 'package:graduation_project1/models/hook_result.dart';
import 'package:graduation_project1/models/products_model.dart';
import 'package:http/http.dart' as http;

FetchHook useFetchFilteredProducts({
  List<String>? brands,
  List<String>? categories,
  List<String>? sizes,
}) {
  final products = useState<List<Product>?>(null);
  final isLoading = useState<bool>(false);
  final error = useState<Exception?>(null);
  final apiError = useState<ApiError?>(null);

  Future<void> fetchData() async {
    isLoading.value = true;

    try {
      // Always fetch all products
      final uri = Uri.parse('$appBaseUrl/user/products');

      final response = await http.get(uri);

      if (response.statusCode == 200) {
        final parsedModel = productsModelFromJson(response.body);
        List<Product> allProducts = parsedModel.products;

        // Apply local filters
        final filteredProducts = allProducts.where((product) {
          final productBrandName = product.brand.name;
          final productCategoryName = product.category.name;
          final productSizes = List<String>.from(product.sizes ?? []);

          final matchesBrand = brands == null ||
              brands.isEmpty ||
              brands.contains(productBrandName);

          final matchesCategory = categories == null ||
              categories.isEmpty ||
              categories.contains(productCategoryName);

          final matchesSize = sizes == null ||
              sizes.isEmpty ||
              productSizes.any((size) => sizes.contains(size));

          return matchesBrand && matchesCategory && matchesSize;
        }).toList();

        products.value = filteredProducts;
      } else {
        products.value = [];
      }
    } catch (e) {
      debugPrint('❌ Exception: $e');
      error.value = e is Exception ? e : Exception(e.toString());
    } finally {
      isLoading.value = false;
    }
  }

  useEffect(() {
    fetchData();
    return null;
  }, [brands, categories, sizes]);

  return FetchHook(
    data: products.value,
    isLoading: isLoading.value,
    error: error.value,
    refetch: fetchData,
  );
}
