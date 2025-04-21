import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class BannerImages extends StatelessWidget {
  const BannerImages({
    super.key,
    this.isNetworkimage = false,
    required this.imageUrl,
  });

  final bool isNetworkimage;
  final String imageUrl;
  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.symmetric(
        horizontal: 20.w,
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(10),
        child: Image(
            fit: BoxFit.fitWidth,
            image: isNetworkimage
                ? NetworkImage(imageUrl)
                : AssetImage(imageUrl) as ImageProvider),
      ),
    );
  }
}
