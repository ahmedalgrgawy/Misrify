import 'package:flutter/material.dart';
import 'package:graduation_project1/constants/constants.dart';
import 'package:graduation_project1/models/api_error_model.dart';
import 'package:graduation_project1/models/hook_result.dart';
import 'package:graduation_project1/models/products_model.dart';
import 'package:http/http.dart' as http;

import 'generic_fetch_hook.dart'; // 🔁 new utility import

// 🔁 Hook 1: All Products
FetchHook useFetchAllProducts() {
  return useGenericFetch<Product>(
    onFetch: () async {
      final url = Uri.parse('$appBaseUrl/user/products');
      final response = await http.get(url);
      debugPrint('fetch all: ${response.statusCode}');

      if (response.statusCode == 200) {
        return productsModelFromJson(response.body).products;
      } else {
        throw apiErrorFromJson(response.body);
      }
    },
  );
}

// 🔁 Hook 2: New Arrivals
FetchHook useFetchNewArrivals() {
  return useGenericFetch<Product>(
    onFetch: () async {
      final url = Uri.parse('$appBaseUrl/user/products');
      final response = await http.get(url);

      if (response.statusCode == 200) {
        final now = DateTime.now();
        final products = productsModelFromJson(response.body).products;

        return products
            .where((p) =>
                now.difference(p.createdAt).inDays <= 365)
            .toList()
          ..sort((a, b) => b.createdAt.compareTo(a.createdAt));
      } else {
        throw apiErrorFromJson(response.body);
      }
    },
  );
}

// 🔁 Hook 3: Discounted Products
FetchHook useFetchDiscountedProducts() {
  return useGenericFetch<Product>(
    onFetch: () async {
      final url = Uri.parse('$appBaseUrl/user/products');
      final response = await http.get(url);
      debugPrint('fetch discount: ${response.statusCode}');

      if (response.statusCode == 200) {
        final products = productsModelFromJson(response.body).products;

        return products
            .where((p) => p.isDiscounted && p.discountAmount > 0)
            .toList()
          ..sort((a, b) => b.discountAmount.compareTo(a.discountAmount));
      } else {
        throw apiErrorFromJson(response.body);
      }
    },
  );
}
