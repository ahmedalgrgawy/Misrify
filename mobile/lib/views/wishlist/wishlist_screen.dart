import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';
import 'package:graduation_project1/common/app_style.dart';
import 'package:graduation_project1/common/custom_button.dart';
import 'package:graduation_project1/common/reusable_text.dart';
import 'package:graduation_project1/common/shimmers/foodlist_shimmer.dart';
import 'package:graduation_project1/controllers/controllers.auth/login_controller.dart';
import 'package:graduation_project1/hooks/fetch_wishlist.dart';
import 'package:graduation_project1/models/wishlist_response.dart';
import 'package:graduation_project1/views/auth/login_redirect.dart';
import 'package:graduation_project1/views/entrypoint.dart';
import 'package:graduation_project1/views/products/Product_page.dart';
import 'package:graduation_project1/views/wishlist/widgets/wishlist_tile.dart';
import '../../constants/constants.dart';

class WishlistScreen extends HookWidget {
  const WishlistScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final hookResult = useFetchwishlist();
    final wishlistProducts =
        useState<List<WishlistItem>>(hookResult.data ?? []);
    final isLoading = hookResult.isLoading;
    final refetch = hookResult.refetch;

    useEffect(() {
      wishlistProducts.value = hookResult.data ?? [];
      return null;
    }, [hookResult.data]);

    final controller = Get.put(LoginController());
    final box = GetStorage();
    final token = box.read('token');

    if (token == null) return const LoginRedirect();

    return Scaffold(
      body: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 12.0),
              child: Center(
                child: ReusableText(
                  text: 'Favourites',
                  align: TextAlign.center,
                  style: appStyle(18, kDarkBlue, FontWeight.w600),
                ),
              ),
            ),
            isLoading
                ? const Expanded(child: FoodsListShimmer())
                : wishlistProducts.value.isEmpty
                    ? Expanded(
                        child: Padding(
                          padding: const EdgeInsets.only(left: 35.0),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.center,
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              SizedBox(
                                height: height * .24,
                                child: Image.asset(
                                  'assets/banners/EmptyWishlist.png',
                                  fit: BoxFit.contain,
                                ),
                              ),
                              SizedBox(height: 20.h),
                              ReusableText(
                                text: 'Your Wishlist is Empty',
                                style: appStyle(20, kDarkBlue, FontWeight.w600),
                                align: TextAlign.center,
                              ),
                              SizedBox(height: 20.h),
                              ReusableText(
                                text:
                                    'Tap heart button to start saving your Fav items',
                                style: appStyle(12, kDarkBlue, FontWeight.w400),
                                align: TextAlign.center,
                              ),
                              SizedBox(height: 20.h),
                              CustomButton(
                                onTap: () {
                                  Get.offAll(() => MainScreen());
                                },
                                btnColor: Colors.white,
                                text: 'Add Now',
                                textcolor: kDarkBlue,
                                btnWidth: 300,
                                btnHeight: 60,
                                borderColor: kDarkBlue,
                              ),
                            ],
                          ),
                        ),
                      )
                    : Expanded(
                        child: ListView.builder(
                          key: ValueKey(wishlistProducts.value.length),
                          padding: const EdgeInsets.symmetric(horizontal: 10.0),
                          itemCount: wishlistProducts.value.length,
                          itemBuilder: (context, i) {
                            final wishlist = wishlistProducts.value[i];
                            return WishlistTile(
                              wishlist: wishlist,
                              ontap: () {
                                Get.to(() => ProductDetailScreen(
                                      product: wishlist.toProduct(),
                                    ));
                              },
                              refetch: () async {
                                if (refetch != null) await refetch();
                                wishlistProducts.value = hookResult.data ?? [];
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
