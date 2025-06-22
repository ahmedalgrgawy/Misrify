import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';
import 'package:flutter_native_splash/flutter_native_splash.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';
import 'package:graduation_project1/constants/constants.dart';
import 'package:graduation_project1/controllers/cart_controller.dart';
import 'package:graduation_project1/controllers/notification_controller.dart';
import 'package:graduation_project1/controllers/profile_controller.dart';
import 'package:graduation_project1/controllers/wishlist_controller.dart';
import 'package:graduation_project1/data/repositories/authentication_repository.dart';
import 'package:graduation_project1/firebase_options.dart';
import 'package:graduation_project1/views/entrypoint.dart';

Widget defaultHome = MainScreen();
final RouteObserver<ModalRoute<void>> routeObserver =
    RouteObserver<ModalRoute<void>>();

Future<void> main() async {
  final WidgetsBinding widgetsBinding =
      WidgetsFlutterBinding.ensureInitialized();

  await GetStorage.init();

  final cartController = Get.put(CartController());
  await cartController.refreshCartCount();
  Get.put(NotificationController()); // ✅ register once
  Get.put(WishlistController()); // ✅ register once
  Get.put(ProfileController()); // ✅ register once

  FlutterNativeSplash.preserve(widgetsBinding: widgetsBinding);
  await Firebase.initializeApp(options: DefaultFirebaseOptions.currentPlatform)
      .then(
    (FirebaseApp value) => Get.put(AuthenticationRepository()),
  );

  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return ScreenUtilInit(
      designSize: const Size(375, 825),
      minTextAdapt: true,
      splitScreenMode: true,
      builder: (context, child) {
        return GetMaterialApp(
          navigatorObservers: [routeObserver],
          debugShowCheckedModeBanner: false,
          theme: ThemeData(
              scaffoldBackgroundColor: Kbackground,
              iconTheme: const IconThemeData(color: kLightWhite),
              primarySwatch: Colors.grey),
          home: const Scaffold(
            backgroundColor: kLightWhite,
            body: Center(
              child: CircularProgressIndicator(
                color: kGray,
              ),
            ),
          ),
        );
      },
    );
  }
}
