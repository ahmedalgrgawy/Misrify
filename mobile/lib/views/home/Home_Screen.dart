import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:get/get.dart';
import 'package:graduation_project1/common/custom_button.dart';
import 'package:graduation_project1/constants/constants.dart';
import 'package:graduation_project1/controllers/category_controller.dart';
import 'package:graduation_project1/controllers/controllers.auth/login_controller.dart';
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

class HomeScreen extends StatelessWidget {
  static const String routeName = "Home_Screen";

  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final login = Get.put(LoginController());
    final controller = Get.put(CategoryController());
    final TextEditingController searchController = TextEditingController();

    return SafeArea(
      child: Scaffold(
        appBar: Appbar(
          padd:
              EdgeInsets.only(left: 20.w, right: 20.w, top: 22.h, bottom: 3.h),
          title: 'Misrify',
        ),
        body: ListView(
          children: [
            SearchContainer(
              controller: searchController,
            ),
            const BannerSlider(),
//category
            SectionHeading(
              title: 'Categories',
              onPress: () {
                Get.to(() => const CategoriesScreen(),
                    duration: const Duration(milliseconds: 900),
                    transition: Transition.cupertino);
              },
            ),
            const CategoryList(),

            Obx(
              () => controller.categoryValue == ''
                  ? Column(
                      children: [
//Best sellers
                        SectionHeading(
                          title: 'Best Sellers',
                          onPress: () {
                            Get.to(() => const AllbestSeller(),
                                duration: const Duration(milliseconds: 900),
                                transition: Transition.cupertino);
                          },
                        ),
                        ProductList(),

//new arrivals
                        SectionHeading(
                          title: 'New Products',
                          onPress: () {
                            Get.to(() => const AllnewArrival(),
                                duration: const Duration(milliseconds: 900),
                                transition: Transition.cupertino);
                          },
                        ),
                        ProductList(),

//Special Offers
                        SectionHeading(
                          title: 'Special Offers',
                          onPress: () {
                            Get.to(() => const AllspecialOffers(),
                                duration: const Duration(milliseconds: 900),
                                transition: Transition.cupertino);
                          },
                        ),
                        ProductList(),
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
                  : CustomButton(
                      onTap: () {
                        login.logout();
                      },
                      btnColor: kRed,
                      text: 'Logout',
                      btnWidth: 100,
                    ),
            ),

//logout
          ],
        ),
      ),
    );
  }
}
