import 'package:flutter/material.dart';

class AllnewArrival extends StatelessWidget {
  static const String routeName = "Home_Screen";

  const AllnewArrival({super.key});

  @override
  Widget build(BuildContext context) {
    return SafeArea(
        child: Scaffold(appBar: AppBar(title: const Text("New Arrival"))));
  }
}
