import 'package:flutter/material.dart';

class SearchScreen extends StatelessWidget {
  static const String routeName = "Home_Screen";

  const SearchScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return SafeArea(
        child: Scaffold(appBar: AppBar(title: const Text("Search"))));
  }
}
