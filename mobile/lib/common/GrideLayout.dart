import 'package:flutter/material.dart';

class GrideLayout extends StatelessWidget {
  final int itemCount;
  final int crossAxiscount;
  final double? mainAxis;
  final double crossAxisspacing;
  final bool shrinkwrap;
  final double mainAxisspacing;
  final Widget? Function(BuildContext, int) itemBuilder;
  final Axis scrooldirection;
  final ScrollPhysics? physics; // NEW

  const GrideLayout({
    super.key,
    this.shrinkwrap = true,
    this.itemCount = 4,
    required this.itemBuilder,
    this.mainAxis = 165,
    this.scrooldirection = Axis.horizontal,
    this.crossAxiscount = 1,
    this.crossAxisspacing = 0,
    this.mainAxisspacing = 0,
    this.physics, // NEW
  });

  @override
  Widget build(BuildContext context) {
    return GridView.builder(
      itemCount: itemCount,
      shrinkWrap: shrinkwrap,
      scrollDirection: scrooldirection,
      physics: physics, // 🔥 ADD THIS
      gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: crossAxiscount,
        mainAxisExtent: mainAxis,
        crossAxisSpacing: crossAxisspacing,
        mainAxisSpacing: mainAxisspacing,
      ),
      itemBuilder: itemBuilder,
    );
  }
}
