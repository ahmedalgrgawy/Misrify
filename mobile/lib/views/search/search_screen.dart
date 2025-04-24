import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:get/get.dart';
import 'package:graduation_project1/common/shimmers/nearby_shimmer.dart';
import 'package:graduation_project1/controllers/search_products_controller.dart';
import 'package:graduation_project1/views/search/widgets/search_container.dart';
import 'package:graduation_project1/views/search/widgets/loading_widget.dart';
import 'package:graduation_project1/views/search/widgets/search_results.dart';

class SearchScreen extends StatefulWidget {
  static const String routeName = "Home_Screen";

  const SearchScreen({super.key});

  @override
  State<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends State<SearchScreen> {
  @override
  Widget build(BuildContext context) {
    final controller = Get.put(SearchProductsController());

    return Obx(() => Scaffold(
          body: SafeArea(
            child: Column(
              children: [
                Padding(
                  padding: EdgeInsets.only(bottom: 30.0.h),
                  child: const SearchContainer(),
                ),
                Expanded(
                  child: controller.isLoading
                      ? const NearbyShimmer()
                      : controller.searcResults == null
                          ? const LoadingWidget()
                          : const SearchResults(),
                ),
              ],
            ),
          ),
        ));
  }
}
