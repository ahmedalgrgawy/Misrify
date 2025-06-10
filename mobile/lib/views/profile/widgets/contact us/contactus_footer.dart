import 'package:flutter/material.dart';
import 'package:graduation_project1/common/app_style.dart';
import 'package:graduation_project1/common/reusable_text.dart';
import 'package:graduation_project1/constants/constants.dart';

class ContactusFooter extends StatelessWidget {
  const ContactusFooter({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      color: kDarkBlue,
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          ReusableText(
            text: 'MISRIFY',
            style: appStyle(
              30,
              Colors.white,
              FontWeight.w700,
            ),
          ),
          const SizedBox(height: 8),
          ReusableText(
            maxlines: 4,
            text: 'Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit.',
            style: appStyle(13, kLightGray, FontWeight.w400),
          ),
          const SizedBox(height: 24),
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Company Column
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    ReusableText(
                      text: 'Company',
                      style: appStyle(
                        16,
                        Colors.white,
                        FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 16),
                    _buildFooterLink('About'),
                    const SizedBox(height: 8),
                    _buildFooterLink('Features'),
                    const SizedBox(height: 8),
                    _buildFooterLink('Works'),
                    const SizedBox(height: 8),
                    _buildFooterLink('Career'),
                  ],
                ),
              ),

              // Help Column
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    ReusableText(
                      text: 'Help',
                      style: appStyle(
                        16,
                        Colors.white,
                        FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 16),
                    _buildFooterLink('Customer Support'),
                    const SizedBox(height: 8),
                    _buildFooterLink('Delivery Details'),
                    const SizedBox(height: 8),
                    _buildFooterLink('Terms & Conditions'),
                    const SizedBox(height: 8),
                    _buildFooterLink('Privacy Policy'),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),
          // Resources
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              ReusableText(
                text: 'Resources',
                style: appStyle(
                  16,
                  Colors.white,
                  FontWeight.bold,
                ),
              ),
              const SizedBox(height: 16),
              _buildFooterLink('Free eBooks'),
              const SizedBox(height: 8),
              _buildFooterLink('Development Tutorial'),
              const SizedBox(height: 8),
              _buildFooterLink('How to - Blog'),
              const SizedBox(height: 8),
              _buildFooterLink('Youtube Playlist'),
            ],
          ),
          const SizedBox(height: 32),
          Center(
            child: ReusableText(
              text: '© Copyright 2025, All Rights Reserved',
              style: appStyle(12, Colors.white, FontWeight.w400),
            ),
          ),
        ],
      ),
    );
  }
}

Widget _buildFooterLink(String text) {
  return Text(
    text,
    style: const TextStyle(color: Colors.white70, fontSize: 14),
  );
}
