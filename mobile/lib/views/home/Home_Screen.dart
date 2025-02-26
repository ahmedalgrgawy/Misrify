import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:graduation_project1/common/custom_button.dart';
import 'package:graduation_project1/constants/constants.dart';
import 'package:graduation_project1/controllers/controllers.auth/login_controller.dart';
import 'package:graduation_project1/views/home/widgets/Appbar.dart';
import 'package:graduation_project1/views/home/widgets/search_container.dart';

class HomeScreen extends StatelessWidget {
  static const String routeName = "Home_Screen";

  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final controller = Get.put(LoginController());

    return SafeArea(
      child: Scaffold(
        backgroundColor: kLightWhite,
        appBar: Appbar(
          padd: const EdgeInsets.only(left: 20, right: 20, top: 22, bottom: 10),
          title: 'Misrify',
        ),
        body: ListView(
          children: [
            const SearchContainer(),
            CustomButton(
              onTap: () {
                controller.logout();
              },
              btnColor: kRed,
              text: 'Logout',
              btnWidth: 100,
            )
          ],
        ),
      ),
    );
  }
}
