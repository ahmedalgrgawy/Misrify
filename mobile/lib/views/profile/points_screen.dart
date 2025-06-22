import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:get/get.dart';
import 'package:graduation_project1/common/app_style.dart';
import 'package:graduation_project1/common/reusable_text.dart';
import 'package:graduation_project1/constants/constants.dart';
import 'package:graduation_project1/controllers/coupon_controller.dart';
import 'package:graduation_project1/hooks/fetch_all_coupones.dart';
import 'package:graduation_project1/hooks/fetch_profile.dart';
import 'package:graduation_project1/views/profile/widgets/points/coupon_tile.dart';
import 'package:graduation_project1/views/profile/widgets/points/points_container.dart';

class PointsScreen extends HookWidget {
  const PointsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final couponController = Get.put(CouponController());
    final couponHook = useFetchAllCoupons();
    final profileHook = useFetchProfile();
    final showInstructions = useState(false);
    final user = profileHook.data?.user;

    return Scaffold(
      appBar: AppBar(
        backgroundColor: Kbackground,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: KTextColor),
          onPressed: () => Get.back(),
        ),
        title: ReusableText(
          text: 'Points & Coupons',
          style: appStyle(18, KTextColor, FontWeight.w600),
        ),
        centerTitle: true,
        actions: [
          IconButton(
            onPressed: () => showInstructions.value = !showInstructions.value,
            tooltip: showInstructions.value
                ? "Hide Instructions"
                : "Show Instructions",
            icon: const Icon(
              Icons.info_outline,
              color: KblueOcean,
            ),
          )
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.only(left: 20, right: 20, top: 20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Points and Coupons Summary
            Row(
              children: [
                Expanded(
                  child: PointsContainer(
                      quantity: user?.points ?? 0, title: "points"),
                ),
                SizedBox(width: 6.w),
                Expanded(
                  child: PointsContainer(
                    quantity: (couponHook.data ?? [])
                        .where((c) =>
                            c.isActive &&
                            c.expirationDate.isAfter(DateTime.now().toUtc()))
                        .length,
                    title: "Coupons",
                  ),
                ),
              ],
            ),

            // Instructions (Hidden by default)
            if (showInstructions.value)
              Padding(
                padding: EdgeInsets.only(top: 12.h),
                child: Container(
                  width: double.infinity,
                  padding: EdgeInsets.all(12.w),
                  decoration: BoxDecoration(
                    color: Colors.lightBlue.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(8.r),
                    border: Border.all(color: kLightBlue),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text("How It Works:",
                          style: appStyle(14, KTextColor, FontWeight.w600)),
                      SizedBox(height: 6.h),
                      Text("• You earn points by placing orders.",
                          style: appStyle(12, KTextColor, FontWeight.w400)),
                      Text("• Redeem points to generate discount coupons.",
                          style: appStyle(12, KTextColor, FontWeight.w400)),
                      Text("• Each coupon can be used only once.",
                          style: appStyle(12, KTextColor, FontWeight.w400)),
                      Text(
                          "• Copy the code and apply it when placing your order.",
                          style: appStyle(12, KTextColor, FontWeight.w400)),
                    ],
                  ),
                ),
              ),

            const SizedBox(height: 15),

            // Points Input Field
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20.0),
              child: TextField(
                controller: couponController.couponTextController,
                decoration: InputDecoration(
                  hintText: 'Enter Points',
                  hintStyle: appStyle(14, Knavbarlabels, FontWeight.w400),
                  filled: true,
                  fillColor: Colors.white,
                  contentPadding:
                      EdgeInsets.symmetric(horizontal: 16.w, vertical: 12.h),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(4.r),
                    borderSide: BorderSide.none,
                  ),
                  suffixIcon: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: KblueOcean,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.only(
                          topRight: Radius.circular(4.r),
                          bottomRight: Radius.circular(4.r),
                        ),
                      ),
                    ),
                    onPressed: () async {
                      final text =
                          couponController.couponTextController.text.trim();
                      if (text.isEmpty || int.tryParse(text) == null) {
                        Get.snackbar(
                          'Invalid Input',
                          'Please enter a valid number of points',
                          backgroundColor: kRed,
                          colorText: kLightWhite,
                        );
                        return;
                      }

                      final points = int.parse(text);
                      await couponController.createCoupon(
                        points,
                        onSuccess: () async {
                          couponController.couponTextController.clear();
                          await profileHook.refetch?.call();
                          await couponHook.refetch?.call();
                        },
                      );
                    },
                    child: Text(
                      "Redeem",
                      style: appStyle(14, Colors.white, FontWeight.w500),
                    ),
                  ),
                ),
              ),
            ),

            const SizedBox(height: 15),

            ReusableText(
              text: 'Active Coupons',
              style: appStyle(20, KTextColor, FontWeight.w600),
            ),
            const SizedBox(height: 10),

            // Active Coupons List
            Expanded(
              child: Builder(
                builder: (_) {
                  if (couponHook.isLoading) {
                    return const Center(child: CircularProgressIndicator());
                  }

                  final activeCoupons = (couponHook.data ?? [])
                      .where((c) =>
                          c.isActive &&
                          c.expirationDate.isAfter(DateTime.now().toUtc()))
                      .toList();

                  if (activeCoupons.isEmpty) {
                    return const Center(child: Text('No active coupons.'));
                  }

                  return ListView.builder(
                    itemCount: activeCoupons.length,
                    itemBuilder: (context, index) {
                      final coupon = activeCoupons[index];
                      return Padding(
                        padding: const EdgeInsets.symmetric(vertical: 4.0),
                        child: CouponTile(
                          descount: coupon.discount.toDouble(),
                          code: coupon.code,
                          expirDate: coupon.expirationDate.toIso8601String(),
                        ),
                      );
                    },
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
