import 'package:flutter/material.dart';

class GrideLayout extends StatelessWidget {
  final int itemCount;
  final double? mainAxis;
  final Widget? Function(BuildContext, int) itemBuilder;
  const GrideLayout(
      {super.key,
      this.itemCount = 4,
      required this.itemBuilder,
      this.mainAxis = 205});

  @override
  Widget build(BuildContext context) {
    return GridView.builder(
      itemCount: itemCount,
      shrinkWrap: true,
      scrollDirection: Axis.horizontal,
      gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 1,
        mainAxisExtent: mainAxis,
        crossAxisSpacing: 20,
        //mainAxisSpacing: 20
      ),
      itemBuilder: itemBuilder,
    );
  }
}
