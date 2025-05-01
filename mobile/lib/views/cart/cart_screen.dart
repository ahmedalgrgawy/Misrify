import 'package:flutter/material.dart';

class CartScreen extends StatelessWidget {
  static const String routeName = "Home_Screen";

  const CartScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return SafeArea(child: Scaffold(appBar: AppBar(title: const Text("Cart"))));
  }
}
