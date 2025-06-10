import 'package:flutter/material.dart';
import 'package:graduation_project1/views/profile/widgets/help%20and%20support/help_and_support_screen.dart';

class FAQPage extends StatelessWidget {
  static const String routeName = "widget_help";
  const FAQPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF9FAFB), // light background
      appBar: AppBar(
        title: const Text('Asked Questions'),
        backgroundColor: Color(0xff15253F),
        foregroundColor: Colors.white,
      ),
      body: const SingleChildScrollView(child: FAQSection()),
    );
  }
}
