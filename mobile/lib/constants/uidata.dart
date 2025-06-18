import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

List<dynamic> categories = [
  {
    "_id": "6537ece708ff5b7de97d0695",
    "title": "Hoodies",
    "value": "hoodies",
    "imageUrl":
        "https://static.vecteezy.com/system/resources/previews/035/438/654/non_2x/ai-generated-blue-hoodie-isolated-on-transparent-background-free-png.png",
    "createdAt": "2023-10-24T16:12:23.571Z",
    "updatedAt": "2023-10-24T16:12:23.571Z",
    "__v": 0
  },
  {
    "_id": "65310f3381e4d98d60b093c5",
    "title": "Pants",
    "value": "pants",
    "imageUrl":
        "https://static.vecteezy.com/system/resources/previews/034/928/389/non_2x/ai-generated-linen-pants-clip-art-free-png.png",
    "__v": 0
  },
  {
    "_id": "6531206cbbe4998e90af3feb",
    "title": "T-shirts",
    "value": "t-shirts",
    "imageUrl":
        "https://static.vecteezy.com/system/resources/previews/035/277/002/non_2x/ai-generated-isolated-blue-t-shirt-front-view-free-png.png",
    "__v": 0
  },
  {
    "_id": "6531209dbbe4998e90af3fef",
    "title": "Shoes",
    "value": "shoes",
    "imageUrl":
        "https://static.vecteezy.com/system/resources/previews/056/522/177/non_2x/a-pair-of-black-and-white-running-shoes-free-png.png",
    "__v": 0
  },
  {
    "_id": "653120babbe4998e90af3ff1",
    "title": "Skin Care",
    "value": "Skin_care",
    "imageUrl":
        "https://static.vecteezy.com/system/resources/previews/025/028/064/non_2x/anti-aging-cream-cosmetics-skin-face-face-cream-face-people-generative-ai-free-png.png",
    "__v": 0
  },
  {
    "_id": "65312084bbe4998e90af3fed",
    "title": "Makeup",
    "value": "makeup",
    "imageUrl":
        "https://static.vecteezy.com/system/resources/previews/047/821/087/non_2x/high-quality-realistic-beautiful-cosmetic-product-image-free-png.png",
    "__v": 0
  },
  {
    "_id": "653120e1bbe4998e90af3ff3",
    "title": "More",
    "value": "more",
    "imageUrl":
        "https://static.vecteezy.com/system/resources/previews/025/268/566/non_2x/fried-rice-with-ai-generated-free-png.png",
    "__v": 0
  }
];

const String termsText = '''
Welcome to the UTU Attendance App! These terms and conditions outline the rules and regulations for the use of the app. By accessing this app, we assume you accept these terms and conditions in full. Do not continue to use the UTU Attendance App if you do not accept all of the terms and conditions stated on this page. 

1. Usage 
1.1. The UTU Attendance App is provided to employees of [Company Name] for the sole purpose of managing attendance, leaves, and related tasks.
1.2. You agree to use the app in compliance with all applicable laws, rules, and regulations. 

2. Account Registration 
2.1. To access the app, you must register using your valid phone number and OTP (One-Time Password). 
2.2. You are responsible for maintaining the confidentiality of your account and password. You agree to notify us immediately of any unauthorized use of your account. 

3. Attendance Tracking 
3.1. The app utilizes geofencing technology to track your location when marking attendance. By using the app, you consent to this location tracking feature. 
3.2. The accuracy of location-based attendance marking may vary based on network and GPS conditions. 

4. Leave Application 
4.1. The app allows you to apply for leaves. All leave applications are subject to the company's leave policies and manager approval. 
4.2. The company reserves the right to reject or modify leave requests based on business needs and policies. 

5. Profile 
5.1. You are responsible for providing accurate and up-to-date information in your profile. 
5.2. The company may use the information provided in your profile for administrative purposes related to employment. 

6. Holidays 
6.1. The app may display information about company holidays for reference purposes. 
6.2. Company holidays may be subject to change based on business requirements. 
''';

const String privacyText = '''
This Privacy Policy describes how [Company Name] collects, uses, and protects the information you provide when using the UTU Attendance App. 

1. Information Collection 
1.1. Personal Information: When you register and use the UTU Attendance App, we may collect personal information such as your name, phone number, and profile details. 
1.2. Attendance Data: The app collects attendance data, including timestamps and location information through geofencing technology when you mark attendance. 
1.3. Leave Application: Information submitted when applying for leaves, including leave type, duration, and reason, is stored within the app. 

2. Use of Information 
2.1. Attendance Tracking: Attendance data, including location information, is used solely for the purpose of managing employee attendance records. 
2.2. Leave Management: Information provided during leave applications is used to process and manage employee leaves in accordance with company policies. 2.3. Profile Information: Personal details in your profile are used for administrative purposes related to employment, such as contact information and job role. 

3. Data Security 
3.1. We are committed to ensuring the security of your information. The UTU Attendance App employs industry-standard security measures to protect your data from unauthorized access, alteration, disclosure, or destruction. 
3.2. Access to your personal information is restricted to authorized personnel who have a need to access this data for the purposes outlined in this Privacy Policy. 

4. Information Sharing 
4.1. We do not sell, trade, or otherwise transfer your personal information to outside parties unless required for legal compliance, law enforcement, or as necessary for the operation and maintenance of the app. 
4.2. In certain instances, we may share aggregated and anonymized data for analytical purposes or reporting. 

5. Third-Party Services 
5.1. The UTU Attendance App may contain links to third-party websites or services. We are not responsible for the privacy practices or content of these third-party sites. 

6. Consent 
6.1. By using the UTU Attendance App, you consent to the collection and use of your information as outlined in this Privacy Policy. 

''';

class FAQItem {
  final IconData icon;
  final String title;
  final String description;

  FAQItem({required this.icon, required this.title, required this.description});
}

final List<FAQItem> faqItems = [
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

class OnBoardingText {
  static const String onBoardingTitle1 = "Shopping app";
  static const String onBoardingTitle2 = "Successful purchase";
  static const String onBoardingTitle3 = "Payment Online";

  static const String onBoardingSubTitle1 =
      "Welcome to our application dedicated to e-shopping, specialized in displaying Egyptian brands.";
  static const String onBoardingSubTitle2 =
      "Our first goal is for the user to be able to carry out successful purchase operations.";
  static const String onBoardingSubTitle3 =
      "We will provide you with more than one way to pay online";
}

class LogoImages {
  static const String firstPage = "assets/onboarding/1.svg";
  static const String secondPage = "assets/onboarding/2.svg";
  static const String thirdPage = "assets/onboarding/3.svg";
}

class BannersImages {
  static const List<String> banners = [
    'assets/banners/banner1.png',
    'assets/banners/banner2.png',
    'assets/banners/banner3.png',
    'assets/banners/banner4.png',
    'assets/banners/banner5.png',
  ];
}

final List<String> productimage = [
  'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=2080&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?q=80&w=1974&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1563389234808-52344934935c?q=80&w=1974&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1527719327859-c6ce80353573?q=80&w=1964&auto=format&fit=crop',
];
