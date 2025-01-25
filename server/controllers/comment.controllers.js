// This Function is for Admin Only
export const deleteComment = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ success: false, message: "Comment Id is Required" })
    }

    const CommentToDelete = await Comment.findById(id);

    if (!CommentToDelete) {
        return res.status(404).json({ success: false, message: "Comment Not Found" })
    }

    await CommentToDelete.remove();

    res.status(200).json({ success: true, message: "Comment Deleted" })
}

// This Function is for Merchant Only
// TODO: Implement Create Comment for Merchant