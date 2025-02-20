import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_vector_icons/flutter_vector_icons.dart';
import 'package:get/get.dart';
import 'package:graduation_project1/common/app_style.dart';
import 'package:graduation_project1/constants/constants.dart';
import 'package:graduation_project1/controllers/tap_index_controller.dart';
import 'package:graduation_project1/views/cart/widgets/cart_screen.dart';
import 'package:graduation_project1/views/home/Home_Screen.dart';
import 'package:graduation_project1/views/profile/profile_screen.dart';
import 'package:graduation_project1/views/wishlist/wishlist_screen.dart';

// ignore: must_be_immutable
class MainScreen extends StatelessWidget {
  MainScreen({super.key});
  List<Widget> pagelist = const [
    HomeScreen(),
    WishlistScreen(),
    CartScreen(),
    ProfileScreen()
  ];
  @override
  Widget build(BuildContext context) {
    final controller = Get.put(TapIndexController());
    return Obx(() => Scaffold(
          body: Stack(
            children: [
              pagelist[controller.tapIndex],
              Align(
                alignment: Alignment.bottomCenter,
                child: Theme(
                    data: Theme.of(context).copyWith(canvasColor: kLightWhite),
                    child: BottomNavigationBar(
                      showSelectedLabels: true,
                      showUnselectedLabels: true,
                      selectedItemColor: kBlue,
                      unselectedItemColor: kGray,
                      selectedLabelStyle:
                          TextStyle(fontWeight: FontWeight.w700, fontSize: 12),
                      unselectedLabelStyle:
                          TextStyle(fontWeight: FontWeight.w500, fontSize: 12),
                      selectedIconTheme: const IconThemeData(color: kBlue),
                      unselectedIconTheme: const IconThemeData(color: kGray),
                      onTap: (value) {
                        controller.setTapIndex = value;
                      },
                      currentIndex: controller.tapIndex,
                      items: [
                        BottomNavigationBarItem(
                            icon: controller.tapIndex == 0
                                ? const Icon(
                                    Icons.home,
                                    size: 28,
                                  )
                                : const Icon(
                                    Icons.home_outlined,
                                    size: 28,
                                  ),
                            label: 'HOME'),
                        BottomNavigationBarItem(
                            icon: controller.tapIndex == 1
                                ? const Badge(
                                    label: Text('1'),
                                    child: const Icon(CupertinoIcons.bag_fill),
                                  )
                                : const Badge(
                                    label: Text('1'),
                                    child: Icon(CupertinoIcons.bag),
                                  ),
                            label: 'SHOP'),
                        BottomNavigationBarItem(
                            icon: controller.tapIndex == 2
                                ? const Icon(CupertinoIcons.heart_fill)
                                : const Icon(CupertinoIcons.heart),
                            label: 'WISHLIST'),
                        BottomNavigationBarItem(
                            icon: controller.tapIndex == 3
                                ? const Icon(FontAwesome.user_circle)
                                : const Icon(FontAwesome.user_circle_o),
                            label: 'ACCOUNT')
                      ],
                    )),
              )
            ],
          ),
        ));
  }
}
