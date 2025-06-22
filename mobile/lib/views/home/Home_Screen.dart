import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:get/get.dart';
import 'package:graduation_project1/controllers/cart_controller.dart';
import 'package:graduation_project1/controllers/category_controller.dart';
import 'package:graduation_project1/controllers/notification_controller.dart';
import 'package:graduation_project1/hooks/fetch_all_products.dart';
import 'package:graduation_project1/main.dart';
import 'package:graduation_project1/views/categories/categories_Screen.dart';
import 'package:graduation_project1/views/home/AllBest_seller.dart';
import 'package:graduation_project1/views/home/AllNew_arrival.dart';
import 'package:graduation_project1/views/home/AllSpecial_offers.dart';
import 'package:graduation_project1/views/home/widgets/Appbar.dart';
import 'package:graduation_project1/views/home/widgets/SectionHeading.dart';
import 'package:graduation_project1/views/categories/widgets/category_list.dart';
import 'package:graduation_project1/views/home/widgets/banner_slider.dart';
import 'package:graduation_project1/views/search/widgets/search_container.dart';
import 'package:graduation_project1/views/products/widgets/product_list.dart';

class HomeScreen extends StatefulHookWidget {
  const HomeScreen({super.key});
  static const String routeName = "Home_Screen";

  @override
  _HomeScreenState createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> with RouteAware {
  final cartController = Get.find<CartController>();
  final notificationsController = Get.find<NotificationController>();
  final categoryController = Get.put(CategoryController());

  @override
  void initState() {
    super.initState();
    _refetch(); // initial fetch
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    routeObserver.subscribe(this, ModalRoute.of(context)!);
  }

  @override
  void dispose() {
    routeObserver.unsubscribe(this);
    super.dispose();
  }

  // ✅ Triggered when user navigates back to this screen
  @override
  void didPopNext() {
    _refetch();
  }

  void _refetch() {
    categoryController.updateCategoryId = '';
    categoryController.updateTitle = '';
    cartController.refreshCartCount();
    notificationsController.fetchNotifications();
  }

  @override
  Widget build(BuildContext context) {
    final bestSellers = useFetchAllProducts();
    final newArrivals = useFetchNewArrivals();
    final specialOffers = useFetchDiscountedProducts();
    final TextEditingController searchController = TextEditingController();

    return SafeArea(
      child: Scaffold(
        appBar: Appbar(
          padding:
              EdgeInsets.only(left: 20.w, right: 20.w, top: 22.h, bottom: 20.h),
          title: 'Misrify',
        ),
        body: ListView(
          children: [
            SearchContainer(controller: searchController),
            const BannerSlider(),
            SectionHeading(
              title: 'Categories',
              onPress: () => Get.to(() => CategoriesScreen()),
            ),
            const CategoryList(),
            Obx(() => categoryController.categoryIdValue == ''
                ? Column(
                    children: [
                      SectionHeading(
                        title: 'Best Sellers',
                        onPress: () => Get.to(() => const AllbestSeller()),
                      ),
                      ProductList(hookresults: bestSellers),
                      SectionHeading(
                        title: 'New Products',
                        onPress: () => Get.to(() => const AllnewArrival()),
                      ),
                      ProductList(hookresults: newArrivals),
                      SectionHeading(
                        title: 'Special Offers',
                        onPress: () => Get.to(() => const AllspecialOffers()),
                      ),
                      ProductList(hookresults: specialOffers),
                      const SizedBox(height: 20),
                    ],
                  )
                : const SizedBox.shrink()),
          ],
        ),
      ),
    );
  }
}
