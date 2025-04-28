import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:get/get.dart';
import 'package:graduation_project1/common/GrideLayout.dart';
import 'package:graduation_project1/constants/constants.dart';
import 'package:graduation_project1/controllers/search_products_controller.dart';
import 'package:graduation_project1/models/products_model.dart';
import 'package:graduation_project1/views/products/widgets/searched_product_widget.dart';

class SearchResults extends StatelessWidget {
  const SearchResults({super.key});

  @override
  Widget build(BuildContext context) {
    final controller = Get.put(SearchProductsController());

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 4),
      child: GrideLayout(
        mainAxisspacing: 20,
        mainAxis: 275,
        crossAxiscount: 2,
        scrooldirection: Axis.vertical,
        shrinkwrap: false, // ✅ Let grid take full height
        physics: const BouncingScrollPhysics(),
        itemCount: controller.searcResults?.length ?? 0,
        itemBuilder: (context, i) {
          final Product product = controller.searcResults![i];
          return SearchedProductWidget(product: product);
        },
      ),
    );
  }
}
