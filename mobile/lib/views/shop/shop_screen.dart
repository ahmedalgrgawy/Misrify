import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:get/get.dart';
import 'package:graduation_project1/common/app_style.dart';
import 'package:graduation_project1/common/reusable_text.dart';
import 'package:graduation_project1/constants/constants.dart';
import 'package:graduation_project1/controllers/filter_controller.dart';
import 'package:graduation_project1/data/product_sort.dart';
import 'package:graduation_project1/hooks/fetch_filterd_products.dart';
import 'package:graduation_project1/models/products_model.dart';
import 'package:graduation_project1/views/products/Product_page.dart';
import 'package:graduation_project1/views/search/widgets/search_container.dart';
import 'package:graduation_project1/views/products/widgets/product_widget.dart';
import 'package:graduation_project1/views/shop/widgets/filter_bottom_sheet.dart';

class ShopScreen extends HookWidget {
  static const String routeName = "Home_Screen";

  const ShopScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final filterController = Get.put(FilterController(), permanent: true);
    final TextEditingController searchController = TextEditingController();
    final sortType = useState<String>('Most Popular');

    final selectedBrands =
        useState<List<String>>([...filterController.selectedBrands]);
    final selectedCategories =
        useState<List<String>>([...filterController.selectedCategories]);
    final selectedSizes =
        useState<List<String>>([...filterController.selectedSizes]);

    useEffect(() {
      ever<List<String>>(filterController.selectedBrands, (val) {
        selectedBrands.value = [...val];
      });
      ever<List<String>>(filterController.selectedCategories, (val) {
        selectedCategories.value = [...val];
      });
      ever<List<String>>(filterController.selectedSizes, (val) {
        selectedSizes.value = [...val];
      });
      return null;
    }, []);

    final hookResult = useFetchFilteredProducts(
      brands: selectedBrands.value,
      categories: selectedCategories.value,
      sizes: selectedSizes.value,
    );

    final originalProducts = useState<List<Product>>([]);
    final displayedProducts = useState<List<Product>>([]);

    useEffect(() {
      if (!hookResult.isLoading && hookResult.data != null) {
        originalProducts.value = [...hookResult.data!];
        displayedProducts.value = [...hookResult.data!];

        if (sortType.value != 'Most Popular') {
          displayedProducts.value =
              sortProductsBy(sortType.value, displayedProducts.value);
        }
      }
      return null;
    }, [
      hookResult.data,
      sortType.value,
      selectedBrands.value,
      selectedCategories.value,
      selectedSizes.value
    ]);

    return SafeArea(
      child: Scaffold(
        body: hookResult.isLoading
            ? const Center(child: CircularProgressIndicator())
            : ListView(
                children: [
                  SearchContainer(
                    margin: EdgeInsets.only(
                      right: 14.w,
                      left: 14.w,
                      top: 20.h,
                      bottom: 5.h,
                    ),
                    controller: searchController,
                  ),
                  SizedBox(height: 6.h),
                  Padding(
                    padding: EdgeInsets.symmetric(horizontal: 10.w),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        ReusableText(
                          text: 'Products',
                          style: appStyle(24, kDarkBlue, FontWeight.w600),
                        ),
                        Row(
                          children: [
                            IconButton(
                              icon: const Icon(
                                CupertinoIcons.chevron_up_chevron_down,
                                color: kDarkBlue,
                                size: 25,
                              ),
                              onPressed: () async {
                                final selected = await showMenu<String>(
                                  context: context,
                                  color: Colors.white,
                                  position: const RelativeRect.fromLTRB(
                                      100, 170, 10, 100),
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
                                        style: appStyle(
                                            13, kDarkBlue, FontWeight.w400),
                                      ),
                                    );
                                  }).toList(),
                                );

                                if (selected != null) {
                                  sortType.value = selected;

                                  if (selected == 'Most Popular') {
                                    displayedProducts.value = [
                                      ...originalProducts.value
                                    ];
                                  } else {
                                    displayedProducts.value = sortProductsBy(
                                        selected, originalProducts.value);
                                  }
                                }
                              },
                            ),
                            IconButton(
                              icon: const Icon(
                                CupertinoIcons.slider_horizontal_3,
                                color: kDarkBlue,
                                size: 25,
                              ),
                              onPressed: () {
                                FilterBottomSheet(context);
                              },
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                  Padding(
                    padding:
                        EdgeInsets.symmetric(horizontal: 10.w, vertical: 6.h),
                    child: ReusableText(
                      text: '${displayedProducts.value.length} products found',
                      style: appStyle(16, kDarkBlue, FontWeight.w400),
                    ),
                  ),
                  SizedBox(height: 10.h),
                  if (displayedProducts.value.isEmpty)
                    Padding(
                      padding: EdgeInsets.symmetric(horizontal: 16.w),
                      child: Center(
                        child: Text(
                          selectedCategories.value.isNotEmpty
                              ? "No products found in selected categories."
                              : selectedBrands.value.isNotEmpty
                                  ? "No products found in selected brands."
                                  : "No products found.",
                          textAlign: TextAlign.center,
                        ),
                      ),
                    )
                  else
                    Padding(
                      padding: EdgeInsets.symmetric(horizontal: 12.w),
                      child: GridView.builder(
                        shrinkWrap: true,
                        physics: const NeverScrollableScrollPhysics(),
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
                            onTap: () {
                              Get.to(
                                  () => ProductDetailScreen(product: product));
                            },
                            id: product.id,
                            title: product.name,
                            brand: product.brand.name,
                            price: product.price.toStringAsFixed(2),
                            isDiscounted: product.isDiscounted,
                            discountAmount: product.discountAmount,
                            image:
                                // product.colors.isNotEmpty
                                //     ? product.colors.first
                                "https://plus.unsplash.com/premium_photo-1664472724753-0a4700e4137b?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                          );
                        },
                      ),
                    ),
                ],
              ),
      ),
    );
  }
}
