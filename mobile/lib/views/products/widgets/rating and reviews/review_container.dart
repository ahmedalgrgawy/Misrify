import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';
import 'package:graduation_project1/common/app_style.dart';
import 'package:graduation_project1/common/reusable_text.dart';
import 'package:graduation_project1/constants/constants.dart';
import 'package:graduation_project1/controllers/reviews_controller.dart';
import 'package:graduation_project1/models/products_model.dart';

class ReviewInputContainer extends StatefulWidget {
  final String productId;
  final Function(Review) onReviewSubmitted;

  // ✅ New for editing
  final bool isUpdateMode;
  final String? reviewId;
  final int? initialRating;
  final String? initialText;
  final Function(Review)? onUpdateReview;

  const ReviewInputContainer({
    super.key,
    required this.productId,
    required this.onReviewSubmitted,
    this.isUpdateMode = false,
    this.reviewId,
    this.initialRating,
    this.initialText,
    this.onUpdateReview,
  });

  @override
  State<ReviewInputContainer> createState() => _ReviewInputContainerState();
}

class _ReviewInputContainerState extends State<ReviewInputContainer> {
  final _reviewTextController = TextEditingController();
  int _rating = 0;
  bool _isSubmitted = false;

  final ReviewController reviewController = Get.put(ReviewController());
  final box = GetStorage();

  @override
  void initState() {
    super.initState();
    if (widget.initialText != null) {
      _reviewTextController.text = widget.initialText!;
    }
    if (widget.initialRating != null) {
      _rating = widget.initialRating!;
    }
  }

  @override
  void dispose() {
    _reviewTextController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return _isSubmitted
        ? const SizedBox.shrink()
        : Obx(() => Padding(
              padding: const EdgeInsets.symmetric(horizontal: 8.0),
              child: Container(
                padding: const EdgeInsets.all(16),
                margin: const EdgeInsets.only(top: 16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  boxShadow: [
                    BoxShadow(
                      color: kLightGray,
                      blurRadius: 8,
                      offset: const Offset(0, 2),
                    ),
                  ],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    ReusableText(
                      text: widget.isUpdateMode
                          ? 'Edit Review'
                          : 'Write a Review',
                      style: appStyle(18, KTextColor, FontWeight.bold),
                    ),
                    const SizedBox(height: 10),
                    TextField(
                      controller: _reviewTextController,
                      maxLines: 3,
                      decoration: InputDecoration(
                        hintText: 'Enter your review here...',
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                    ),
                    const SizedBox(height: 12),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Row(
                          children: List.generate(5, (index) {
                            return IconButton(
                              onPressed: () {
                                setState(() {
                                  _rating = index + 1;
                                });
                              },
                              icon: Icon(
                                index < _rating
                                    ? Icons.star
                                    : Icons.star_border,
                                color: Colors.amber,
                                size: 28,
                              ),
                              padding: EdgeInsets.zero,
                              constraints: const BoxConstraints(),
                            );
                          }),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        onPressed: reviewController.isLoading
                            ? null
                            : () async {
                                final reviewText =
                                    _reviewTextController.text.trim();
                                if (reviewText.isEmpty || _rating == 0) {
                                  Get.snackbar(
                                    'Missing',
                                    'Please provide both rating and review text.',
                                    colorText: kLightWhite,
                                    backgroundColor: kLightBlue,
                                  );
                                  return;
                                }

                                final currentUserId =
                                    box.read('userId') ?? 'You';

                                if (widget.isUpdateMode &&
                                    widget.reviewId != null) {
                                  // ✅ UPDATE FLOW
                                  await reviewController.updateReview(
                                    reviewId: widget.reviewId!,
                                    rating: _rating,
                                    reviewText: reviewText,
                                  );

                                  final updatedReview = Review(
                                    id: widget.reviewId!,
                                    user: currentUserId,
                                    rating: _rating,
                                    reviewText: reviewText,
                                    comments: [],
                                    createdAt: DateTime.now(),
                                    updatedAt: DateTime.now(),
                                    v: 0,
                                  );

                                  widget.onUpdateReview?.call(updatedReview);
                                  setState(() => _isSubmitted = true);
                                } else {
                                  // ✅ CREATE FLOW
                                  final response =
                                      await reviewController.submitReview(
                                    productId: widget.productId,
                                    rating: _rating,
                                    reviewText: reviewText,
                                  );

                                  if (response != null &&
                                      response['review'] != null) {
                                    final reviewJson = response['review'];
                                    final newReview =
                                        Review.fromJson(reviewJson)
                                            .copyWith(user: currentUserId);
                                    widget.onReviewSubmitted(newReview);
                                    setState(() => _isSubmitted = true);
                                  }
                                }
                              },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: kBlue,
                          padding: const EdgeInsets.symmetric(vertical: 12),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(10),
                          ),
                        ),
                        child: reviewController.isLoading
                            ? const CircularProgressIndicator(
                                color: Colors.white,
                                strokeWidth: 2,
                              )
                            : Text(
                                widget.isUpdateMode
                                    ? 'Update Review'
                                    : 'Submit Review',
                                style: const TextStyle(
                                    color: Colors.white, fontSize: 16),
                              ),
                      ),
                    ),
                  ],
                ),
              ),
            ));
  }
}
