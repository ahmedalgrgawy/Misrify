import 'package:flutter/material.dart';

class AllspecialOffers extends StatelessWidget {
  static const String routeName = "Home_Screen";

  const AllspecialOffers({super.key});

  @override
  Widget build(BuildContext context) {
    return SafeArea(
        child: Scaffold(appBar: AppBar(title: const Text("Special Offers"))));
  }
}
