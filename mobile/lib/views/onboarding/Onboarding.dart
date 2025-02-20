import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:graduation_project1/constants/constants.dart';
import 'package:graduation_project1/constants/uidata.dart';
import 'package:graduation_project1/controllers/controllers.onboarding/onboarding_controller.dart';
import 'package:graduation_project1/views/onboarding/widgets/dotnavigation.dart';
import 'package:graduation_project1/views/onboarding/widgets/nextbutton.dart';
import 'package:graduation_project1/views/onboarding/widgets/onboardingPage.dart';
import 'package:graduation_project1/views/onboarding/widgets/skipbutton.dart';

class OnboardingScreen extends StatelessWidget {
  const OnboardingScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final controller = Get.put(OnBoardingController());
    return Obx(
      () => Scaffold(
        backgroundColor: Kbackground,
        body: Stack(
          children: [
            PageView(
              controller: controller.pageController,
              onPageChanged: controller.updatePageIndicator,
              children: const [
                OnBoardingPage(
                  image: LogoImages.firstPage,
                  title: OnBoardingText.onBoardingTitle1,
                  subTitle: OnBoardingText.onBoardingSubTitle1,
                ),
                OnBoardingPage(
                  image: LogoImages.secondPage,
                  title: OnBoardingText.onBoardingTitle2,
                  subTitle: OnBoardingText.onBoardingSubTitle2,
                ),
                OnBoardingPage(
                  image: LogoImages.thirdPage,
                  title: OnBoardingText.onBoardingTitle3,
                  subTitle: OnBoardingText.onBoardingSubTitle3,
                )
              ],
            ),
            if (controller.currentPageIndex != 2) SkipButton(),
            const DotNavigation(),
            const NextButton()
          ],
        ),
      ),
    );
  }
}
