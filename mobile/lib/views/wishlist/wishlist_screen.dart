import 'package:flutter/material.dart';

class WishlistScreen extends StatelessWidget {
  static const String routeName = "Home_Screen";

  const WishlistScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return SafeArea(
        child: Scaffold(appBar: AppBar(title: const Text("wishlist"))));
  }
}
