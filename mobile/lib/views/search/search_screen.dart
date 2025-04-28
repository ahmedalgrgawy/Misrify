import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:graduation_project1/common/shimmers/nearby_shimmer.dart';
import 'package:graduation_project1/controllers/search_products_controller.dart';
import 'package:graduation_project1/views/search/widgets/search_results.dart';

class SearchScreen extends StatefulWidget {
  final String? initialSearch;
  const SearchScreen({super.key, this.initialSearch});

  @override
  State<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends State<SearchScreen> {
  late final TextEditingController _controller;
  final searchController = Get.put(SearchProductsController());

  @override
  void initState() {
    super.initState();
    _controller = TextEditingController(text: widget.initialSearch ?? "");
    if (widget.initialSearch?.isNotEmpty ?? false) {
      searchController.searchProduct(widget.initialSearch!.trim());
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _handleSubmit(String query) {
    if (query.trim().isNotEmpty) {
      searchController.searchProduct(query.trim());
      _controller.clear();
      FocusScope.of(context).unfocus();
    }
  }

  @override
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        title: TextField(
          controller: _controller,
          onSubmitted: _handleSubmit,
          decoration: const InputDecoration(
            hintText: "Search for products...",
            border: InputBorder.none,
          ),
        ),
      ),
      body: Obx(() {
        final isLoading = searchController.isLoading;
        final results = searchController.searcResults;

        if (isLoading) {
          return const NearbyShimmer();
        }

        if (results == null) {
          return const Center(child: Text("Search for something..."));
        }

        if (results.isEmpty) {
          return const Center(child: Text("No products found."));
        }

        return Padding(
          padding: const EdgeInsets.only(top: 20.0),
          child: const SearchResults(),
        );
      }),
    );
  }
}
