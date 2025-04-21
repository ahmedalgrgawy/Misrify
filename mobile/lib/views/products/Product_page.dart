import 'package:flutter/material.dart';

class ProductPage extends StatelessWidget {
  static const String routeName = "Home_Screen";

  const ProductPage({super.key});

  @override
  Widget build(BuildContext context) {
    return SafeArea(
        child: Scaffold(appBar: AppBar(title: const Text("Product Page"))));
  }
}
