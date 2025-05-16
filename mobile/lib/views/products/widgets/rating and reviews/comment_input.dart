import 'package:flutter/material.dart';
import 'package:graduation_project1/constants/constants.dart';

class CommentInputField extends StatelessWidget {
  final TextEditingController controller;
  final String? editingCommentId;
  final VoidCallback onSubmit;

  const CommentInputField({
    Key? key,
    required this.controller,
    required this.editingCommentId,
    required this.onSubmit,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        border: Border(bottom: BorderSide(color: kLightGray)),
      ),
      child: Row(
        children: [
          Expanded(
            child: TextField(
              controller: controller,
              onSubmitted: (_) => onSubmit(),
              decoration: InputDecoration(
                hintText: editingCommentId != null
                    ? "Edit your comment..."
                    : "Add a comment...",
                hintStyle: const TextStyle(fontSize: 14, color: kLightGray),
                isDense: true,
                border: InputBorder.none,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
