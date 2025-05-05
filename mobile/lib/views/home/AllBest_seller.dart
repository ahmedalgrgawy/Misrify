import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:graduation_project1/common/app_style.dart';
import 'package:graduation_project1/common/reusable_text.dart';
import 'package:graduation_project1/constants/constants.dart';
import 'package:graduation_project1/hooks/fetch_all_products.dart';
import 'package:graduation_project1/views/home/widgets/all_products_list.dart';

class AllbestSeller extends HookWidget {
  const AllbestSeller({super.key});

  @override
  Widget build(BuildContext context) {
    final hookResult = useFetchAllProducts();
    final products = hookResult.data;
    final isLoading = hookResult.isLoading;

    return SafeArea(
      child: Scaffold(
        appBar: AppBar(
          backgroundColor: Kbackground,
          title: ReusableText(
            text: "Best Seller",
            style: appStyle(16, kDarkBlue, FontWeight.w500),
          ),
        ),
        body: isLoading
            ? const Center(child: CircularProgressIndicator())
            : (products == null || products.isEmpty)
                ? const Center(child: Text("No new arrivals found."))
                : SingleChildScrollView(
                    child: AllProductsList(products: products),
                  ),
      ),
    );
  }
}
