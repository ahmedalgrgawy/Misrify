import mongoose from "mongoose";
import AppError from "../errors/AppError.js";
import Comment from "../models/comment.model.js";
import Product from "../models/product.model.js";
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
    const { reviewId } = req.params;
    const { text } = req.body;
    const userId = req.user?._id;

    if (!userId) 
        return next(new AppError("Unauthorized: Please log in to comment", 401));

    if (!reviewId) 
        return next(new AppError("Review ID is required", 400));
    if (!mongoose.Types.ObjectId.isValid(reviewId)) 
        return next(new AppError("Invalid Review ID", 400));

    if (!text || !text.trim()) 
        return next(new AppError("Comment text cannot be empty", 400));
    if (text.trim().length < 3) 
        return next(new AppError("Comment must be at least 3 characters long", 400));

    const review = await Review.findById(reviewId).populate("comments");
    if (!review) 
        return next(new AppError("Review Not Found", 404));

    const newComment = await Comment.create({
        text: text.trim(),
        user: userId,
        review: reviewId
    });

    review.comments.push(newComment._id);
    await review.save().catch(err => next(new AppError("Error saving review", 500)));

    res.status(201).json({
        success: true,
        comment: newComment
    });
};

// User functions only

export const updateComment = async (req, res, next) => {
    const { commentId } = req.params;
    const { text } = req.body;
    const userId = req.user?._id;

    if (!userId) 
        return next(new AppError("Unauthorized: Please log in to edit comments", 401));

    if (!mongoose.Types.ObjectId.isValid(commentId)) return next(new AppError("Invalid Comment ID", 400));

    if (!text || !text.trim()) 
        return next(new AppError("Comment text cannot be empty", 400));
    if (text.trim().length < 3) 
        return next(new AppError("Comment must be at least 3 characters long", 400));

    try {
        const comment = await Comment.findById(commentId);
        if (!comment) 
            return next(new AppError("Comment not found", 404));

        if (comment.user.toString() !== userId.toString()) {
            return next(new AppError("Unauthorized: You can only edit your own comments", 403));
        }

        comment.text = text.trim();
        await comment.save();

        res.status(200).json({
            success: true,
            message: "Comment updated successfully",
            comment
        });
    } catch (error) {
        next(new AppError("Error updating comment", 500));
    }
};


export const deleteCommentUser = async (req, res, next) => {
    const { commentId } = req.params;
    const userId = req.user?._id;

    if (!userId) 
        return next(new AppError("Unauthorized: Please log in to delete comments", 401));

    if (!mongoose.Types.ObjectId.isValid(commentId)) return next(new AppError("Invalid Comment ID", 400));

    try {
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
    } catch (error) {
        next(new AppError("Error deleting comment", 500));
    }
};

