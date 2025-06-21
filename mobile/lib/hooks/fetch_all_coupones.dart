import 'dart:convert';

import 'package:get_storage/get_storage.dart';
import 'package:graduation_project1/constants/constants.dart';
import 'package:graduation_project1/models/coupon_model.dart';
import 'package:graduation_project1/models/api_error_model.dart';
import 'package:graduation_project1/models/hook_result.dart';
import 'package:http/http.dart' as http;
import 'generic_fetch_hook.dart';

FetchHook useFetchAllCoupons() {
  final box = GetStorage();

  return useGenericFetch<Coupon>(
    onFetch: () async {
      final token = box.read('token');
      final url = Uri.parse('$appBaseUrl/user/coupon');

      final response = await http.get(
        url,
        headers: {
          'Cookie': 'accessToken=$token',
          'Content-Type': 'application/json',
        },
      );

      print("🔁 Total coupons fetch status: ${response.statusCode}");
      print("🔁 Response body: ${response.body}");

      if (response.statusCode == 200) {
        final allCoupons = AllCouponsModel.fromJson(
          Map<String, dynamic>.from(jsonDecode(response.body)),
        );
        print("🔁 Total coupons fetched: ${allCoupons.coupons.length}");
        return allCoupons.coupons;
      } else {
        throw apiErrorFromJson(response.body);
      }
    },
  );
}
