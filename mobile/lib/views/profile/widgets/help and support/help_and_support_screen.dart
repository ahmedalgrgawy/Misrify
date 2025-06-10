import 'package:flutter/material.dart';
import 'package:graduation_project1/constants/constants.dart';

class FAQSection extends StatelessWidget {
  const FAQSection({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 40),
      padding: const EdgeInsets.all(16),
      child: GridView.builder(
        shrinkWrap: true,
        physics: const NeverScrollableScrollPhysics(),
        gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: _getCrossAxisCount(context),
          crossAxisSpacing: 24,
          mainAxisSpacing: 24,
          childAspectRatio: 1.2,
        ),
        itemCount: _faqItems.length,
        itemBuilder: (context, index) {
          final item = _faqItems[index];
          return Container(
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(8),
              boxShadow: [
                BoxShadow(
                  color: Colors.grey.withOpacity(0.1),
                  spreadRadius: 1,
                  blurRadius: 6,
                  offset: const Offset(0, 3),
                ),
              ],
            ),
            padding: const EdgeInsets.all(32),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(
                  item.icon,
                  color: kNavy, // main-blue equivalent
                  size: 48,
                ),
                const SizedBox(height: 16),
                Text(
                  item.title,
                  style: const TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.w600,
                    color: kNavy, // main-blue equivalent
                  ),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 8),
                Expanded(
                  child: Text(
                    item.description,
                    style: const TextStyle(
                      fontSize: 14,
                      color: Color(0xFF6B7280), // dark-grey equivalent
                    ),
                    textAlign: TextAlign.center,
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  int _getCrossAxisCount(BuildContext context) {
    final width = MediaQuery.of(context).size.width;
    if (width >= 1024) return 2; // lg breakpoint
    if (width >= 768) return 2; // md breakpoint
    return 1; // default (mobile)
  }

  static final List<FAQItem> _faqItems = [
    FAQItem(
      icon: Icons.store,
      title: "What do we do?",
      description:
          "Misrify aims to connect Egyptian brands and stores with consumers, promoting local products and supporting economic growth.",
    ),
    FAQItem(
      icon: Icons.inventory_2_outlined,
      title: "What products are available?",
      description:
          "You can find a variety of Egyptian brands and stores, showcasing a wide range of categories from traditional crafts to modern goods.",
    ),
    FAQItem(
      icon: Icons.local_shipping,
      title: "How can I track my order?",
      description:
          "Once your order is confirmed, you will receive tracking information via email, allowing you to monitor its status.",
    ),
    FAQItem(
      icon: Icons.undo,
      title: "What is the return policy?",
      description:
          "Customers can return products within a specified period if unsatisfied, provided items are in original condition.",
    ),
    FAQItem(
      icon: Icons.chat_bubble_outline,
      title: "How do I leave a review for a product?",
      description:
          "After purchasing a product, you can leave a review on the product page by rating it and providing your feedback.",
    ),
    FAQItem(
      icon: Icons.credit_card,
      title: "What payment methods do you accept?",
      description:
          "The marketplace supports a variety of payment options, including credit/debit cards and digital wallets.",
    ),
    FAQItem(
      icon: Icons.school,
      title: "What are student special codes?",
      description:
          "Student special codes allow you to earn points for discounts and promotions on the platform. Use your university email to access these benefits!",
    ),
    FAQItem(
      icon: Icons.smart_toy,
      title: "What is Misrify Bot?",
      description:
          "It's AI system analyzes your previous purchases and items in your cart to suggest products that you may be interested in, enhancing your shopping experience.",
    ),
  ];
}

class FAQItem {
  final IconData icon;
  final String title;
  final String description;

  FAQItem({required this.icon, required this.title, required this.description});
}
