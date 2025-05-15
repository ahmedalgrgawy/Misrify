import 'package:flutter/material.dart';
import 'package:get_storage/get_storage.dart';
import 'package:graduation_project1/common/app_style.dart';
import 'package:graduation_project1/common/reusable_text.dart';
import 'package:graduation_project1/constants/constants.dart';
import 'package:graduation_project1/models/products_model.dart';
import 'package:graduation_project1/controllers/comments_controller.dart';
import 'package:get/get.dart';
import 'package:graduation_project1/views/products/widgets/rating%20and%20reviews/comment_input.dart';
import 'package:graduation_project1/views/products/widgets/rating%20and%20reviews/comments_list.dart';

class UserReviews extends StatefulWidget {
  final Review review;
  final String currentUserId;
  final String productId;
  final VoidCallback? onDelete;
  final VoidCallback? onEdit;

  const UserReviews({
    super.key,
    required this.review,
    required this.currentUserId,
    required this.productId,
    this.onDelete,
    this.onEdit,
  });

  @override
  State<UserReviews> createState() => _UserReviewsState();
}

class _UserReviewsState extends State<UserReviews> {
  bool showComments = false;
  final controller = TextEditingController();
  final commentsController = Get.put(CommentsController());
  final box = GetStorage();
  List<Map<String, dynamic>> fetchedComments = [];
  String? editingCommentId;

  @override
  void initState() {
    super.initState();
    _fetchComments();
  }

  Future<void> _fetchComments() async {
    final results = await Future.wait(widget.review.comments.map((id) async {
      final data = await commentsController.fetchCommentById(id);
      if (data != null && data['user'] is Map && data['user']['_id'] != null) {
        data['user'] = data['user']['_id'];
      }
      return data;
    }));

    setState(() {
      fetchedComments = results.whereType<Map<String, dynamic>>().toList();
    });
  }

  void submitComment() async {
    final text = controller.text.trim();
    if (text.isEmpty) return;

    if (editingCommentId != null) {
      final success =
          await commentsController.updateComment(editingCommentId!, text);
      if (success) {
        final index =
            fetchedComments.indexWhere((c) => c['_id'] == editingCommentId);
        if (index != -1) {
          setState(() {
            fetchedComments[index]['text'] = text;
            editingCommentId = null;
            controller.clear();
          });
        }
      }
    } else {
      final created =
          await commentsController.createComment(text, widget.review.id);
      if (created != null && created is Map<String, dynamic>) {
        setState(() {
          fetchedComments.add(created);
          controller.clear();
          showComments = true;
          widget.review.comments.add(created['_id']);
        });
      }
    }
  }

  void startEdit(String id, String text) {
    setState(() {
      editingCommentId = id;
      controller.text = text;
    });
  }

  void deleteComment(String id) async {
    final success = await commentsController.deleteComment(id);
    if (success) {
      setState(() {
        fetchedComments.removeWhere((c) => c['_id'] == id);
        widget.review.comments.remove(id);
      });
    }
  }

  String timeAgo(DateTime date) {
    final now = DateTime.now();
    final diff = now.difference(date);
    if (diff.inMinutes < 1) return 'Just now';
    if (diff.inMinutes < 60) return '${diff.inMinutes} mins ago';
    if (diff.inHours < 24) return '${diff.inHours} hours ago';
    if (diff.inDays < 7) return '${diff.inDays} days ago';
    return '${date.day}/${date.month}/${date.year}';
  }

  @override
  Widget build(BuildContext context) {
    final review = widget.review;
    final isOwner = review.user == widget.currentUserId;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(width: 8),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // User + menu
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        review.user.length > 6
                            ? 'User${review.user.substring(0, 6)}'
                            : review.user,
                        style: const TextStyle(
                            fontSize: 16, fontWeight: FontWeight.bold),
                      ),
                      if (isOwner)
                        PopupMenuButton<String>(
                          onSelected: (value) {
                            if (value == 'edit') widget.onEdit?.call();
                            if (value == 'delete') widget.onDelete?.call();
                          },
                          itemBuilder: (context) => const [
                            PopupMenuItem(value: 'edit', child: Text('Update')),
                            PopupMenuItem(
                                value: 'delete', child: Text('Delete')),
                          ],
                          icon:
                              const Icon(Icons.more_vert, color: Colors.black),
                        ),
                    ],
                  ),

                  // Rating + time
                  Row(
                    children: [
                      Row(
                        children: List.generate(5, (index) {
                          return Icon(
                            index < review.rating
                                ? Icons.star
                                : Icons.star_border,
                            size: 16,
                            color: Colors.yellow[700],
                          );
                        }),
                      ),
                      const SizedBox(width: 8),
                      Text(
                        timeAgo(review.createdAt),
                        style: const TextStyle(fontSize: 12, color: Kblack),
                      ),
                    ],
                  ),

                  const SizedBox(height: 4),

                  // Review text
                  Text(
                    review.reviewText,
                    style: appStyle(14, KNavyBlack, FontWeight.w300),
                  ),

                  // ✅ Comment input field (always visible)
                  CommentInputField(
                    controller: controller,
                    editingCommentId: editingCommentId,
                    onSubmit: submitComment,
                  ),

                  const SizedBox(height: 12),

                  if (review.comments.isNotEmpty)
                    GestureDetector(
                      onTap: () => setState(() => showComments = !showComments),
                      child: ReusableText(
                        text: showComments
                            ? 'Hide comments (${review.comments.length})'
                            : 'View comments (${review.comments.length})',
                        style: appStyle(
                          11,
                          KblueOcean,
                          FontWeight.w400,
                        ),
                      ),
                    ),

                  if (showComments)
                    CommentList(
                      comments: fetchedComments,
                      currentUserId: widget.currentUserId,
                      onEdit: startEdit,
                      onDelete: deleteComment,
                    ),

                  const SizedBox(height: 12),
                ],
              ),
            ),
          ],
        ),
      ],
    );
  }
}
