import 'package:flutter/material.dart';

class ProfileScreen extends StatefulWidget {
  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  @override
  Widget build(BuildContext context) {
    var title;
    var subtitle;
    return Scaffold(
      appBar: AppBar(
        leading: IconButton(icon: Icon(Icons.arrow_back), onPressed: () {}),
        title: Text('My Profile'),
      ),
      body: Column(
        children: [
          Container(
            child: CircleAvatar(
              backgroundImage: NetworkImage(
                'https://images.unsplash.com/photo-1563389234808-52344934935c?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
              ), // Replace with actual image URL
            ),
          ),
          title = Text('Mohamed Seyam'),
          subtitle = Text('mh16989886@gmail.com'),
          Container(
            margin: EdgeInsets.symmetric(
              horizontal: MediaQuery.of(context).size.width * 0.05,
              vertical: MediaQuery.of(context).size.height * 0.04,
            ),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(24),
            ),
            child: InkWell(
              child: Column(
                children: [
                  ListTile(
                    leading: Icon(Icons.account_circle_outlined),
                    title: Text('Edit profile'),
                    trailing: Icon(Icons.chevron_right),
                    onTap: () {},
                  ),
                  Divider(thickness: 1.5),
                  ListTile(
                    leading: Icon(Icons.ad_units_outlined),
                    title: Text('Orders'),
                    trailing: Icon(Icons.chevron_right),
                    onTap: () {},
                  ),
                  Divider(thickness: 1.5),
                  ListTile(
                    leading: Icon(Icons.location_on),
                    title: Text('Addresses'),
                    trailing: Icon(Icons.chevron_right),
                    onTap: () {},
                  ),
                  Divider(thickness: 1.5),
                  ListTile(
                    leading: Icon(Icons.control_point_duplicate_sharp),
                    title: Text('Your Points'),
                    trailing: Icon(Icons.chevron_right),
                    onTap: () {},
                  ),
                  Divider(thickness: 1.5),
                  ListTile(
                    leading: Icon(Icons.star),
                    title: Text('Reviews'),
                    trailing: Icon(Icons.chevron_right),
                    onTap: () {},
                  ),
                  Divider(thickness: 1.5),
                  ListTile(
                    leading: Icon(Icons.headset_mic_sharp),
                    title: Text('Contact Us'),
                    trailing: Icon(Icons.chevron_right),
                    onTap: () {},
                  ),
                  Divider(thickness: 1.5),
                  ListTile(
                    leading: Icon(Icons.help_outline),
                    title: Text('Help & Support'),
                    trailing: Icon(Icons.chevron_right),
                    onTap: () {},
                  ),
                  Divider(thickness: 1.5),
                  ListTile(
                    leading: Icon(Icons.logout, color: Colors.red),
                    title: Text(
                      'Sign out',
                      style: TextStyle(color: Colors.red),
                    ),
                    trailing: Icon(Icons.chevron_right, color: Colors.red),
                    onTap: () {},
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
