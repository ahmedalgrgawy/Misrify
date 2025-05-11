import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:graduation_project1/common/custom_navbar.dart';
import 'package:graduation_project1/controllers/tap_index_controller.dart';
import 'package:graduation_project1/views/cart/cart_screen.dart';
import 'package:graduation_project1/views/shop/shop_screen.dart';
import 'package:graduation_project1/views/home/Home_Screen.dart';
import 'package:graduation_project1/views/search/search_screen.dart';
import 'package:graduation_project1/views/wishlist/wishlist_screen.dart';

// ignore: must_be_immutable
class MainScreen extends StatelessWidget {
  MainScreen({super.key});

  final List<Widget> pageList = [
    const HomeScreen(),
    const SearchScreen(),
    const WishlistScreen(),
    const ShopScreen(),
    const CartScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    final controller = Get.put(TapIndexController());
    return Obx(() => Scaffold(
          body: pageList[controller.tapIndex],
          bottomNavigationBar: CustomNavBar(
            currentIndex: controller.tapIndex,
            onTap: (index) => controller.setTapIndex = index,
          ),
        ));
  }
}
