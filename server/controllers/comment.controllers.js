import AppError from "../errors/AppError.js";
import Comment from "../models/comment.model.js";
import Notification from "../models/notification.model.js";
import Review from "../models/review.model.js";

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

// This function for User or Merchant 

export const createComment = async (req, res, next) => {
    const { text, reviewId } = req.body;
    const userId = req.user._id;

    // if (!mongoose.Types.ObjectId.isValid(reviewId))
    //     return next(new AppError("Invalid Review ID", 400));

    const review = await Review.findById(reviewId).populate("comments");

    if (!review)
        return next(new AppError("Review Not Found", 404));

    const newComment = await Comment.create({
        text,
        user: userId,
        reviewId: reviewId,
    });


    review.comments.push(newComment._id);

    await review.save()

    await Notification.create({
        receivers: [review.user], // Changed to receivers array
        sender: userId, // Updated to Misrify Store
        content: `New comment on your review`, // Already using content
        type: "product",
        isRead: false,
    });

    res.status(201).json({
        success: true,
        message: "Comment Created",
        comment: newComment
    });
};

// User functions only

export const updateComment = async (req, res, next) => {
    const { commentId } = req.params;
    const { text } = req.body;
    const userId = req.user._id;

    // if (!mongoose.Types.ObjectId.isValid(commentId)) return next(new AppError("Invalid Comment ID", 400));

    const comment = await Comment.findById(commentId);

    if (!comment)
        return next(new AppError("Comment not found", 404));

    if (comment.user.toString() !== userId.toString()) {
        return next(new AppError("Unauthorized: You can only edit your own comments", 403));
    }

    comment.text = text || comment.text;

    await comment.save();

    res.status(200).json({
        success: true,
        message: "Comment updated successfully",
        comment
    });
};


export const deleteCommentUser = async (req, res, next) => {
    const { commentId } = req.params;
    const userId = req.user._id;

    // if (!mongoose.Types.ObjectId.isValid(commentId)) return next(new AppError("Invalid Comment ID", 400));

    const comment = await Comment.findById(commentId);

    if (!comment)
        return next(new AppError("Comment not found", 404));

    if (comment.user.toString() !== userId.toString()) {
        return next(new AppError("Unauthorized: You can only delete your own comments", 403));
    }

    await Review.updateOne({ comments: commentId }, { $pull: { comments: commentId } });

    await comment.deleteOne();

    res.status(200).json({
        success: true,
        message: "Comment deleted successfully"
    });

};
//new
export const getCommentById = async (req, res, next) => {
    const { id } = req.params;

    try {
        const comment = await Comment.findById(id).populate("user", "name");

        if (!comment) {
            return res.status(404).json({ success: false, message: "Comment not found" });
        }

        res.status(200).json({ success: true, comment });
    } catch (err) {
        return next(new AppError("Server Error", 500));
    }
};
