import 'package:flutter/material.dart';
import 'package:graduation_project1/common/app_style.dart';
import 'package:graduation_project1/common/reusable_text.dart';
import 'package:graduation_project1/constants/constants.dart';

class ContactInfoCard extends StatelessWidget {
  const ContactInfoCard({super.key});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Card(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
        ),
        elevation: 4,
        child: Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: kDarkBlue,
            borderRadius: BorderRadius.circular(16),
          ),
          child: Column(
            children: [
              ReusableText(
                  text: 'Contact Information',
                  style: appStyle(24, Colors.white, FontWeight.w600)),
              const SizedBox(height: 8),
              ReusableText(
                  text: 'Say something to start a live chat!',
                  style: appStyle(12, Colors.white, FontWeight.w400)),

              const SizedBox(height: 20),
              // Phone
              Column(
                children: [
                  const Icon(Icons.phone_in_talk, size: 28),
                  const SizedBox(
                    height: 10,
                  ),
                  ReusableText(
                      text: '+1 456 789',
                      style: appStyle(14, Colors.white, FontWeight.w400))
                ],
              ),

              const SizedBox(height: 16),
              // Email
              Column(
                children: [
                  const Icon(Icons.email_outlined, size: 28),
                  const SizedBox(
                    height: 10,
                  ),
                  ReusableText(
                      text: 'demo@gmail.com',
                      style: appStyle(14, Colors.white, FontWeight.w400))
                ],
              ),

              const SizedBox(height: 16),
              // Address
              Column(
                children: [
                  const Icon(Icons.location_on_outlined, size: 28),
                  const SizedBox(
                    height: 10,
                  ),
                  ReusableText(
                      align: TextAlign.center,
                      maxlines: 3,
                      text:
                          '132 Dartmouth Street Boston, Massachusetts 02156 United States',
                      style: appStyle(14, Colors.white, FontWeight.w400))
                ],
              ),

              const SizedBox(height: 24),
              // Social Media Icons
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  _buildSocialIcon(
                    Icons.facebook,
                  ),
                  const SizedBox(width: 16),
                  _buildSocialIcon(Icons.camera_alt),
                  const SizedBox(width: 16),
                  _buildSocialIcon(Icons.telegram),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}

Widget _buildSocialIcon(IconData icon) {
  return Container(
    padding: const EdgeInsets.all(8),
    decoration: BoxDecoration(
      color: Colors.white.withOpacity(0.2),
      shape: BoxShape.circle,
    ),
    child: Icon(icon, color: Colors.white, size: 18),
  );
}
