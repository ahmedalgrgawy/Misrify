import 'package:flutter/material.dart';

class CategoriesScreen extends StatelessWidget {
  static const String routeName = "Home_Screen";

  const CategoriesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return SafeArea(
        child: Scaffold(appBar: AppBar(title: const Text("categories"))));
  }
}
