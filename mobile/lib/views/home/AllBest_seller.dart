import 'package:flutter/material.dart';

class AllbestSeller extends StatelessWidget {
  static const String routeName = "Home_Screen";

  const AllbestSeller({super.key});

  @override
  Widget build(BuildContext context) {
    return SafeArea(
        child: Scaffold(appBar: AppBar(title: const Text("Best Sellers"))));
  }
}
