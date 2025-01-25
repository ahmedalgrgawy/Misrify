import AppError from "../errors/AppError";

// This Function is for Admin Only
export const deleteComment = async (req, res, next) => {
    const { id } = req.params;

    if (!id) {
        return next(new AppError("Comment Id is required", 400))
    }

    const CommentToDelete = await Comment.findById(id);

    if (!CommentToDelete) {
        return next(new AppError("Comment Not Found", 404))
    }

    await CommentToDelete.remove();

    res.status(200).json({ success: true, message: "Comment Deleted" })
}

// This Function is for Merchant Only
// TODO: Implement Create Comment for Merchant