import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:graduation_project1/common/GrideLayout.dart';
import 'package:graduation_project1/models/products_model.dart';
import 'package:graduation_project1/views/products/Product_page.dart';
import 'package:graduation_project1/views/products/widgets/product_widget.dart';

class AllproductsList extends StatelessWidget {
  final List<Product> products;
  const AllproductsList({super.key, required this.products});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 4),
      child: GrideLayout(
        mainAxisspacing: 20,
        mainAxis: 275,
        crossAxiscount: 2,
        scrooldirection: Axis.vertical,
        shrinkwrap: true,
        physics: const NeverScrollableScrollPhysics(),
        itemCount: products.length,
        itemBuilder: (context, i) {
          final product = products[i];
          return ProductWidget(
            onTap: () => Get.to(() => ProductPage()),
            brand: product.brand.name,
            price: product.price.toStringAsFixed(2),
            title: product.name,
          );
        },
      ),
    );
  }
}
