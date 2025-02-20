import 'package:flutter/material.dart';

class ProfileScreen extends StatelessWidget {
  static const String routeName = "Home_Screen";

  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return SafeArea(
        child: Scaffold(appBar: AppBar(title: const Text("profile"))));
  }
}
