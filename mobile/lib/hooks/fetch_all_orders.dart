import 'dart:convert';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';
import 'package:http/http.dart' as http;
import '../models/all_orders_model.dart';
import '../models/hook_result.dart';
import '../constants/constants.dart';
import '../views/auth/login_Screen.dart';

FetchHook useFetchOrders() {
  final orders = useState<List<Order>>([]);
  final isLoading = useState(false);
  final error = useState<Exception?>(null);

  final box = GetStorage();

  // ✅ Declare fetchData first
  late Future<void> Function({bool isRetrying}) fetchData;

  Future<void> refreshTokenAndRetry() async {
    final refreshToken = box.read('refreshToken');
    if (refreshToken == null) {
      Get.offAll(() => const LoginScreen());
      return;
    }

    final refreshUrl = Uri.parse('$appBaseUrl/auth/refresh-token');
    final refreshResponse = await http.post(
      refreshUrl,
      headers: {
        'Cookie': refreshToken,
        'Content-Type': 'application/json',
      },
    );

    if (refreshResponse.statusCode == 200) {
      final newCookie = refreshResponse.headers['set-cookie'];
      if (newCookie != null) {
        final match = RegExp(r'accessToken=([^;]+)').firstMatch(newCookie);
        if (match != null) {
          final newToken = match.group(1);
          box.write('token', newToken);
          await fetchData(isRetrying: true); // ✅ works now
          return;
        }
      }
    }

    Get.offAll(() => const LoginScreen());
  }

  // ✅ Now define the fetchData after declaration
  fetchData = ({bool isRetrying = false}) async {
    isLoading.value = true;
    try {
      final token = box.read('token');
      final response = await http.get(
        Uri.parse('$appBaseUrl/user/orders'),
        headers: {
          'Cookie': 'accessToken=$token',
          'Content-Type': 'application/json',
        },
      );

      final decoded = jsonDecode(response.body);
      if (response.statusCode == 200 && decoded['orders'] != null) {
        orders.value = AllOrderModel.fromJson(decoded).orders;
      } else if (response.statusCode == 401 && !isRetrying) {
        await refreshTokenAndRetry();
      } else {
        orders.value = [];
      }
    } catch (e) {
      error.value = Exception(e.toString());
    } finally {
      isLoading.value = false;
    }
  };

  useEffect(() {
    fetchData();
    return null;
  }, []);

  return FetchHook(
    data: orders.value,
    isLoading: isLoading.value,
    error: error.value,
    refetch: () => fetchData(),
  );
}
