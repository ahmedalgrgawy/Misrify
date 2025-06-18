import 'package:flutter/material.dart';
import 'package:graduation_project1/common/app_style.dart';
import 'package:graduation_project1/common/reusable_text.dart';
import 'package:graduation_project1/constants/constants.dart';

class CommentList extends StatelessWidget {
  final List<Map<String, dynamic>> comments;
  final String currentUserId;
  final void Function(String id, String text) onEdit;
  final void Function(String id) onDelete;

  const CommentList({
    Key? key,
    required this.comments,
    required this.currentUserId,
    required this.onEdit,
    required this.onDelete,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(top: 6.0),
      child: Column(
        children: comments.map((comment) {
          final isOwner = comment['user'] == currentUserId;
          return Padding(
            padding: const EdgeInsets.symmetric(vertical: 6.0),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Expanded(
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      // 👇 Make text flexible
                      Flexible(
                        child: ReusableText(
                          text: comment["text"] ?? "No content",
                          maxlines: 4,
                          style: appStyle(
                            15.5,
                            KTextColor,
                            FontWeight.w400,
                          ),
                        ),
                      ),
                      if (isOwner)
                        PopupMenuButton<String>(
                          icon: const Icon(
                            Icons.more_vert,
                            size: 20,
                            color: kGray,
                          ),
                          onSelected: (value) {
                            if (value == 'edit') {
                              onEdit(comment['_id'], comment['text']);
                            } else if (value == 'delete') {
                              onDelete(comment['_id']);
                            }
                          },
                          itemBuilder: (context) => const [
                            PopupMenuItem(value: 'edit', child: Text('Edit')),
                            PopupMenuItem(
                                value: 'delete', child: Text('Delete')),
                          ],
                        ),
                    ],
                  ),
                ),
              ],
            ),
          );
        }).toList(),
      ),
    );
  }
}
