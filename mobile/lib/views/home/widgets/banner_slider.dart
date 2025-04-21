import 'package:carousel_slider/carousel_slider.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:graduation_project1/constants/uidata.dart';
import 'package:graduation_project1/views/home/widgets/banner_images.dart';

class BannerSlider extends StatelessWidget {
  const BannerSlider({super.key});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(top: 20.0),
      child: SizedBox(
        height: 150.h,
        child: CarouselSlider(
          options: CarouselOptions(viewportFraction: 1, autoPlay: true),
          items: BannersImages.banners
              .map((imageUrl) => BannerImages(imageUrl: imageUrl))
              .toList(),
        ),
      ),
    );
  }
}
