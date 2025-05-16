import 'package:flutter/material.dart';
import 'package:graduation_project1/common/app_style.dart';
import 'package:graduation_project1/common/reusable_text.dart';
import 'package:graduation_project1/constants/constants.dart';
import 'package:graduation_project1/models/products_model.dart';
import 'package:graduation_project1/views/products/widgets/rating and reviews/rating_section.dart';
import 'package:graduation_project1/views/products/widgets/rating and reviews/user_reviews.dart';
import 'package:graduation_project1/views/products/widgets/rating and reviews/review_container.dart';

class ReviewsSection extends StatefulWidget {
  final List<Review> reviews;
  final String currentUserId;
  String productid; // ✅ Add this
  final void Function(Review review)? onDelete;

  ReviewsSection({
    Key? key,
    required this.reviews,
    required this.currentUserId,
    required this.productid, // ✅ Add this
    this.onDelete,
  }) : super(key: key);

  @override
  ReviewsSectionState createState() => ReviewsSectionState();
}

class ReviewsSectionState extends State<ReviewsSection> {
  List<Review> _reviews = [];
  bool showAll = false;
  Review? _reviewBeingEdited;
  bool _isEditing = false;

  @override
  void initState() {
    super.initState();
    _reviews = List.from(widget.reviews);
  }

  void addNewReview(Review review) {
    setState(() {
      _reviews.insert(0, review);
    });
  }

  void handleDelete(Review review) {
    setState(() {
      _reviews.removeWhere((r) => r.id == review.id);
      widget.reviews.removeWhere((r) => r.id == review.id); // Persist delete
    });
    widget.onDelete?.call(review);
  }

  void removeReview(Review review) {
    setState(() {
      _reviews.removeWhere((r) => r.id == review.id);
      widget.reviews.removeWhere((r) => r.id == review.id);
    });
  }

  void handleEdit(Review review) {
    setState(() {
      _reviewBeingEdited = review;
      _isEditing = true;
    });
  }

  void updateExistingReview(Review updated) {
    setState(() {
      final index = _reviews.indexWhere((r) => r.id == updated.id);
      if (index != -1) {
        _reviews[index] = updated;
      }

      // ✅ Also update the original list to persist across page reopen
      final widgetIndex = widget.reviews.indexWhere((r) => r.id == updated.id);
      if (widgetIndex != -1) {
        widget.reviews[widgetIndex] = updated;
      }

      _isEditing = false;
      _reviewBeingEdited = null;
    });
  }

  double get averageRating {
    if (_reviews.isEmpty) return 0.0;
    final total = _reviews.fold(0, (sum, r) => sum + r.rating);
    return total / _reviews.length;
  }

  @override
  Widget build(BuildContext context) {
    if (_reviews.isEmpty) return const SizedBox.shrink();

    final sortedReviews = List<Review>.from(_reviews)
      ..sort((a, b) => b.createdAt.compareTo(a.createdAt));

    final displayedReviews =
        showAll ? sortedReviews : sortedReviews.take(2).toList();

    return Container(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          ReusableText(
            text: 'Product Ratings and Reviews',
            style: appStyle(14, KTextColor, FontWeight.w600),
          ),
          const SizedBox(height: 14),
          RatingSection(
            rate: averageRating,
            reviewsNum: _reviews.length,
          ),
          if (_isEditing && _reviewBeingEdited != null)
            ReviewInputContainer(
              productId: _reviewBeingEdited!.id,
              isUpdateMode: true,
              reviewId: _reviewBeingEdited!.id,
              initialRating: _reviewBeingEdited!.rating,
              initialText: _reviewBeingEdited!.reviewText,
              onUpdateReview: (updatedReview) {
                updateExistingReview(updatedReview);
              },
              onReviewSubmitted: (_) {}, // not used in update mode
            ),
          SizedBox(
            height: 10,
          ),
          if (_reviews.length > 2)
            TextButton.icon(
              onPressed: () => setState(() => showAll = !showAll),
              icon: Icon(
                showAll ? Icons.arrow_drop_up : Icons.arrow_drop_down,
                color: kDarkBlue,
              ),
              label: Text(
                showAll ? 'Show Less' : 'Show All Reviews',
                style: appStyle(14, kDarkBlue, FontWeight.w500),
              ),
            ),
          Column(
            children: displayedReviews
                .map((review) => UserReviews(
                      productId: widget
                          .productid, // ← this comes from ProductDetailScreen
                      review: review,
                      currentUserId: widget.currentUserId,
                      onDelete: () => handleDelete(review),
                      onEdit: () => handleEdit(review),
                    ))
                .toList(),
          ),
        ],
      ),
    );
  }
}
