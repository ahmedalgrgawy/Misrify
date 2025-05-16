import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:get/get.dart';
import 'package:graduation_project1/common/app_style.dart';
import 'package:graduation_project1/common/reusable_text.dart';
import 'package:graduation_project1/constants/constants.dart';
import 'package:graduation_project1/controllers/category_controller.dart';
import 'package:graduation_project1/hooks/fetch_filterd_products.dart';
import 'package:graduation_project1/models/products_model.dart';
import 'package:graduation_project1/data/product_sort.dart';
import 'package:graduation_project1/views/products/Product_page.dart';
import 'package:graduation_project1/views/products/widgets/product_widget.dart';

class AllCategoryProductScreen extends HookWidget {
  const AllCategoryProductScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final controller = Get.find<CategoryController>();
    final categoryName = controller.titleValue;
    final sortType = useState<String>('Most Popular');
    final hookResult = useFetchProductsByCategory(categoryName);
    final originalProducts = useState<List<Product>>([]);
    final displayedProducts = useState<List<Product>>([]);

    useEffect(() {
      final data = hookResult.data;
      if (!hookResult.isLoading && data != null) {
        originalProducts.value = [...data];
        displayedProducts.value = [...data];
        if (sortType.value != 'Most Popular') {
          displayedProducts.value = sortProductsBy(sortType.value, data);
        }
      }
      return null;
    }, [hookResult.data]);

    return WillPopScope(
      onWillPop: () async {
        // ✅ Reset category state before navigating back
        controller.updateCategory = '';
        controller.updateTitle = '';
        return true; // Allow pop
      },
      child: SafeArea(
        child: Scaffold(
          appBar: AppBar(
            backgroundColor: Kbackground,
            title: ReusableText(
              text: categoryName,
              style: appStyle(16, kDarkBlue, FontWeight.w500),
            ),
            actions: [
              IconButton(
                icon: const Icon(Icons.sort, color: kDarkBlue),
                onPressed: () async {
                  final selected = await showMenu<String>(
                    context: context,
                    position: const RelativeRect.fromLTRB(100, 80, 10, 100),
                    items: [
                      'Most Popular',
                      'Newest Arrivals',
                      'Price: Highest to Lowest',
                      'Price: Lowest to Highest',
                      'Best Rated',
                    ].map((label) {
                      return PopupMenuItem(
                        value: label,
                        child: ReusableText(
                          text: label,
                          style: appStyle(13, kDarkBlue, FontWeight.w400),
                        ),
                      );
                    }).toList(),
                  );

                  if (selected != null) {
                    sortType.value = selected;
                    if (selected == 'Most Popular') {
                      displayedProducts.value = [...originalProducts.value];
                    } else {
                      displayedProducts.value = sortProductsBy(
                        selected,
                        [...originalProducts.value],
                      );
                    }
                  }
                },
              ),
            ],
          ),
          body: hookResult.isLoading
              ? const Center(child: CircularProgressIndicator())
              : displayedProducts.value.isEmpty
                  ? const Center(child: Text("No products in this category."))
                  : Padding(
                      padding: EdgeInsets.symmetric(horizontal: 12.w),
                      child: GridView.builder(
                        shrinkWrap: true,
                        physics: const BouncingScrollPhysics(),
                        itemCount: displayedProducts.value.length,
                        gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                          crossAxisCount: 2,
                          mainAxisExtent: 260.h,
                          crossAxisSpacing: 10,
                          mainAxisSpacing: 10,
                        ),
                        itemBuilder: (context, index) {
                          final product = displayedProducts.value[index];
                          return ProductWidget(
                            id: product.id,
                            onTap: () {
                              Get.to(
                                  () => ProductDetailScreen(product: product));
                            },
                            title: product.name,
                            brand: product.brand.name,
                            price: product.price.toStringAsFixed(2),
                            isDiscounted: product.isDiscounted,
                            discountAmount: product.discountAmount,
                            image:
                                "https://plus.unsplash.com/premium_photo-1664472724753-0a4700e4137b?q=80&w=1780&auto=format&fit=crop",
                          );
                        },
                      ),
                    ),
        ),
      ),
    );
  }
}
