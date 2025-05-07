import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:get/get.dart';
import 'package:graduation_project1/common/custom_button.dart';
import 'package:graduation_project1/constants/constants.dart';
import 'package:graduation_project1/controllers/cart_controller.dart';
import 'package:graduation_project1/controllers/category_controller.dart';
import 'package:graduation_project1/controllers/controllers.auth/login_controller.dart';
import 'package:graduation_project1/hooks/fetch_all_products.dart';
import 'package:graduation_project1/views/categories/categories_Screen.dart';
import 'package:graduation_project1/views/home/AllBest_seller.dart';
import 'package:graduation_project1/views/home/AllNew_arrival.dart';
import 'package:graduation_project1/views/home/AllSpecial_offers.dart';
import 'package:graduation_project1/views/home/widgets/Appbar.dart';
import 'package:graduation_project1/views/home/widgets/SectionHeading.dart';
import 'package:graduation_project1/views/categories/widgets/category_list.dart';
import 'package:graduation_project1/views/home/widgets/banner_slider.dart';
import 'package:graduation_project1/views/search/widgets/search_container.dart';
import 'package:graduation_project1/views/products/widgets/product_list.dart';

class HomeScreen extends HookWidget {
  static const String routeName = "Home_Screen";

  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final login = Get.put(LoginController());
    final controller = Get.put(CategoryController());
    final cartController = Get.put(CartController());
    final TextEditingController searchController = TextEditingController();

    // ✅ Reset category + refresh cart count on load
    useEffect(() {
      Future.microtask(() {
        controller.updateCategory = '';
        controller.updateTitle = '';
        cartController
            .refreshCartCount(); // Ensures cart icon shows correct count
      });
      return null;
    }, []);

    final bestSellers = useFetchAllProducts();
    final newArrivals = useFetchNewArrivals();
    final specialOffers = useFetchDiscountedProducts();

    return SafeArea(
      child: Scaffold(
        appBar: Appbar(
          padd:
              EdgeInsets.only(left: 20.w, right: 20.w, top: 22.h, bottom: 3.h),
          title: 'Misrify',
        ),
        body: ListView(
          children: [
            SearchContainer(controller: searchController),
            const BannerSlider(),
            SectionHeading(
              title: 'Categories',
              onPress: () {
                Get.to(() => CategoriesScreen(),
                    duration: const Duration(milliseconds: 900),
                    transition: Transition.cupertino);
              },
            ),
            const CategoryList(),
            Obx(() => controller.categoryValue == ''
                ? Column(
                    children: [
                      SectionHeading(
                        title: 'Best Sellers',
                        onPress: () {
                          Get.to(() => const AllbestSeller(),
                              duration: const Duration(milliseconds: 900),
                              transition: Transition.cupertino);
                        },
                      ),
                      ProductList(hookresults: bestSellers),
                      SectionHeading(
                        title: 'New Products',
                        onPress: () {
                          Get.to(() => const AllnewArrival(),
                              duration: const Duration(milliseconds: 900),
                              transition: Transition.cupertino);
                        },
                      ),
                      ProductList(hookresults: newArrivals),
                      SectionHeading(
                        title: 'Special Offers',
                        onPress: () {
                          Get.to(() => const AllspecialOffers(),
                              duration: const Duration(milliseconds: 900),
                              transition: Transition.cupertino);
                        },
                      ),
                      ProductList(hookresults: specialOffers),
                      CustomButton(
                        onTap: () {
                          login.logout();
                        },
                        btnColor: kRed,
                        text: 'Logout',
                        btnWidth: 100,
                      ),
                    ],
                  )
                : Container()),
          ],
        ),
      ),
    );
  }
}
