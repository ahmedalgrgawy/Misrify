import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:get/get.dart';
import 'package:graduation_project1/common/custom_appbar.dart';
import 'package:graduation_project1/hooks/fetch_all_products.dart';
import 'package:graduation_project1/models/products_model.dart';
import 'package:graduation_project1/views/products/Product_page.dart';
import 'package:graduation_project1/views/products/widgets/product_widget.dart';

class AllnewArrival extends HookWidget {
  const AllnewArrival({super.key});

  @override
  Widget build(BuildContext context) {
    final hookResult = useFetchNewArrivals();
    final originalProducts = useState<List<Product>>([]);
    final displayedProducts = useState<List<Product>>([]);

    useEffect(() {
      if (!hookResult.isLoading && hookResult.data != null) {
        originalProducts.value = [...hookResult.data!];
        displayedProducts.value = [...hookResult.data!];
      }
      return null;
    });

    return Scaffold(
      appBar: CustomAppbar(
        title: "New Arrivals",
        onpress: () {
          Get.back();
        },
      ),
      body: hookResult.isLoading
          ? const Center(child: CircularProgressIndicator())
          : (displayedProducts.value.isEmpty)
              ? const Center(child: Text("No new arrivals found."))
              : Padding(
                  padding: EdgeInsets.symmetric(horizontal: 12.w),
                  child: GridView.builder(
                    shrinkWrap: true,
                    physics: const BouncingScrollPhysics(),
                    itemCount: displayedProducts.value.length,
                    gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 2,
                      mainAxisExtent: 260.h,
                      mainAxisSpacing: 10,
                    ),
                    itemBuilder: (context, index) {
                      final product = displayedProducts.value[index];
                      return ProductWidget(
                        onTap: () {
                          Get.to(() => ProductDetailScreen(product: product));
                        },
                        id: product.id,
                        title: product.name,
                        brand: product.brand.name,
                        price: product.price.toStringAsFixed(2),
                        isDiscounted: product.isDiscounted,
                        discountAmount: product.discountAmount,
                        image: product.imgUrl,
                      );
                    },
                  ),
                ),
    );
  }
}
