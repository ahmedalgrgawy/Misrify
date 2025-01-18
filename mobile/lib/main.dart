import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:get/get_navigation/src/root/get_material_app.dart';
import 'package:graduation_project1/constants/constants.dart';
import 'package:graduation_project1/views/home/Home_Screen.dart';

Widget defaultHome = HomeScreen();

void main() async {
  /*
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(
//    options: DefaultFirebaseOptions.currentPlatform,
      );*/
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
          debugShowCheckedModeBanner: false,
          title: 'Grad',
          theme: ThemeData(
              scaffoldBackgroundColor: kLightBlue,
              iconTheme: const IconThemeData(color: kLightWhite),
              primarySwatch: Colors.grey),
          home: defaultHome,
        );
      },
    );
  }
}
