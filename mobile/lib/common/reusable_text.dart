// ignore_for_file: must_be_immutable, prefer_const_constructors_in_immutables

import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';

class ReusableText extends StatelessWidget {
  ReusableText({
    super.key,
    required this.text,
    required this.style,
    this.maxlines,
    this.align,
    this.SoftWrap,
  });
  final String text;
  final TextStyle style;
  final int? maxlines;
  final TextAlign? align;
  final bool? SoftWrap;

  @override
  Widget build(BuildContext context) {
    return Text(text,
        maxLines: maxlines ?? 1,
        textAlign: align ?? TextAlign.left,
        softWrap: SoftWrap ?? false,
        overflow: TextOverflow.ellipsis,
        style: style);
  }
}
