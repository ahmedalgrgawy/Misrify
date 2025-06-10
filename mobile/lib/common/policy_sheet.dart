import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:graduation_project1/common/app_style.dart';
import 'package:graduation_project1/common/reusable_text.dart';
import 'package:graduation_project1/constants/constants.dart';

void showPolicySheet(BuildContext context, String title, String content) {
  showModalBottomSheet(
    context: context,
    backgroundColor: Colors.white,
    shape: const RoundedRectangleBorder(
      borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
    ),
    isScrollControlled: true,
    builder: (context) => DraggableScrollableSheet(
      expand: false,
      builder: (context, scrollController) => Padding(
        padding: const EdgeInsets.all(16),
        child: ListView(
          controller: scrollController,
          children: [
            Row(
              children: [
                IconButton(
                    onPressed: () {
                      Get.back();
                    },
                    icon: const Icon(
                      Icons.arrow_back,
                      color: kDarkBlue,
                    )),
                Center(
                    child: ReusableText(
                        text: title,
                        style: appStyle(18, kDarkBlue, FontWeight.bold))),
              ],
            ),
            const SizedBox(height: 12),
            Text(content, style: appStyle(14, kGray, FontWeight.w400)),
          ],
        ),
      ),
    ),
  );
}
