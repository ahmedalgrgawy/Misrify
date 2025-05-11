import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:graduation_project1/constants/constants.dart';
import 'package:graduation_project1/models/api_error_model.dart';
import 'package:graduation_project1/models/brands_model.dart';
import 'package:graduation_project1/models/hook_result.dart';
import 'package:http/http.dart' as http;

FetchHook useFetchBrands() {
  final brands = useState<List<Brand>?>(null);
  final isLoading = useState<bool>(false);
  final error = useState<Exception?>(null);
  final apiError = useState<ApiError?>(null);

  Future<void> fetchData() async {
    isLoading.value = true;
    try {
      Uri url = Uri.parse('$appBaseUrl/admin/brands');
      final response = await http.get(url);
      if (response.statusCode == 200) {
        final parsModel = bransModelFromJson(response.body);
        brands.value = parsModel.brands;
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
    fetchData();
    return null;
  }, []);

  Future<void> refetch() async {
    isLoading.value = true;
    fetchData();
  }

  return FetchHook(
      data: brands.value,
      isLoading: isLoading.value,
      error: error.value,
      refetch: refetch);
}
