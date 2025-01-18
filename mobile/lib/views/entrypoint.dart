import 'package:flutter/material.dart';
import 'package:flutter_vector_icons/flutter_vector_icons.dart';

// ignore: must_be_immutable
/*class MainScreen extends StatelessWidget {
  MainScreen({super.key});
  List<Widget> pagelist = const [
    HomePage(),
    SearchPage(),
    CartPage(),
    ProfilePage()
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
                    data: Theme.of(context).copyWith(canvasColor: kPrimary),
                    child: BottomNavigationBar(
                      showSelectedLabels: false,
                      showUnselectedLabels: false,
                      selectedIconTheme: const IconThemeData(color: kSecondary),
                      unselectedIconTheme:
                          const IconThemeData(color: Colors.black38),
                      onTap: (value) {
                        controller.setTapIndex = value;
                      },
                      currentIndex: controller.tapIndex,
                      items: [
                        BottomNavigationBarItem(
                            icon: controller.tapIndex == 0
                                ? const Icon(AntDesign.appstore1)
                                : const Icon(AntDesign.appstore_o),
                            label: 'Home'),
                        const BottomNavigationBarItem(
                            icon: Icon(Icons.search), label: 'Search'),
                        const BottomNavigationBarItem(
                            icon: Badge(
                              label: Text('1'),
                              child: Icon(FontAwesome.opencart),
                            ),
                            label: 'Cart'),
                        BottomNavigationBarItem(
                            icon: controller.tapIndex == 3
                                ? const Icon(FontAwesome.user_circle)
                                : const Icon(FontAwesome.user_circle_o),
                            label: 'Person')
                      ],
                    )),
              )
            ],
          ),
        ));
  }
}*/
