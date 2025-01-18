// ignore_for_file: must_be_immutable, prefer_const_constructors_in_immutables

import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';

class ReusableText extends StatelessWidget {
  ReusableText({
    super.key,
    required this.text,
    required this.style,
  });
  final String text;
  final TextStyle style;
  @override
  Widget build(BuildContext context) {
    return Text(text,
        maxLines: 1, softWrap: false, textAlign: TextAlign.left, style: style);
  }
}
