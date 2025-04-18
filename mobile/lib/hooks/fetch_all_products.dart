import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:graduation_project1/constants/constants.dart';
import 'package:graduation_project1/models/api_error_model.dart';
import 'package:graduation_project1/models/hook_result.dart';
import 'package:graduation_project1/models/products_model.dart';
import 'package:http/http.dart' as http;

FetchHook useFetchAllProducts() {
  final products = useState<List<Product>?>(null);
  final isLoading = useState<bool>(false);
  final error = useState<Exception?>(null);
  final apiError = useState<ApiError?>(null);

  Future<void> fetchData() async {
    isLoading.value = true;
    try {
      Uri url = Uri.parse('$appBaseUrl/user/products');
      final response = await http.get(url);

      if (response.statusCode == 200) {
        final parsedModel = productsModelFromJson(response.body);
        products.value = parsedModel.products;
      } else {
        apiError.value = apiErrorFromJson(response.body);
      }
    } catch (e) {
      debugPrint(e.toString());
    } finally {
      isLoading.value = false;
    }
  }

  useEffect(() {
    Future.delayed(const Duration(seconds: 3));
    fetchData();
    return null;
  }, []);

  void refetch() {
    isLoading.value = true;
    fetchData();
  }

  return FetchHook(
    data: products.value,
    isLoading: isLoading.value,
    error: error.value,
    refetch: refetch,
  );
}
