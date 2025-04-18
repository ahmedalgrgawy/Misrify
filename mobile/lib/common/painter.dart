import 'package:flutter/material.dart';
import 'package:graduation_project1/constants/constants.dart';

class NavBarNotchPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()..color = Colors.white;
    final path = Path();
    final double center = size.width / 2;

    // Draw nav bar with smooth center notch
    path.moveTo(0, 0);
    path.lineTo(center - 45, 0);
    path.quadraticBezierTo(center - 40, 0, center - 40, 15);
    path.arcToPoint(
      Offset(center + 40, 15),
      radius: const Radius.circular(45),
      clockwise: false,
    );
    path.quadraticBezierTo(center + 40, 0, center + 45, 0);
    path.lineTo(size.width, 0);
    path.lineTo(size.width, size.height);
    path.lineTo(0, size.height);
    path.close();

    // ✅ Shadow around bar shape
    canvas.drawShadow(path, KNavyBlack, 8.0, true);

    // ✅ Fill nav bar
    canvas.drawPath(path, paint);

    // ✅ Add white circle frame behind the center button
    final circlePaint = Paint()..color = Colors.white;
    const double circleRadius = 47;
    final Offset circleCenter = Offset(center, 7); // aligns with arc peak
    canvas.drawCircle(circleCenter, circleRadius, circlePaint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
