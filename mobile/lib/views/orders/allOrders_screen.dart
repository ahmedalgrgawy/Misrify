import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:get/get.dart';
import 'package:graduation_project1/common/custom_appbar.dart';
import 'package:graduation_project1/hooks/fetch_all_orders.dart';
import 'package:graduation_project1/views/orders/widgets/order_tile.dart';
import 'package:graduation_project1/views/profile/profile_screen.dart';

class AllOrdersScreen extends HookWidget {
  const AllOrdersScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final result = useFetchOrders();
    final orders = result.data;
    final isLoading = result.isLoading;

    // Sort orders by newest date first
    final sortedOrders = [...orders]
      ..sort((a, b) => b.createdAt.compareTo(a.createdAt));

    return Scaffold(
      appBar: CustomAppbar(
        title: 'My Orders',
        onpress: () {
          Get.to(const ProfileScreen());
        },
      ),
      body: isLoading
          ? const Center(child: CircularProgressIndicator())
          : sortedOrders.isEmpty
              ? const Center(child: Text('No orders found.'))
              : Padding(
                  padding: const EdgeInsets.all(16),
                  child: ListView.builder(
                    itemCount: sortedOrders.length,
                    itemBuilder: (context, index) {
                      return OrderTile(order: sortedOrders[index]);
                    },
                  ),
                ),
    );
  }
}
