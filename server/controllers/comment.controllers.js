import AppError from "../errors/AppError.js";
import Comment from "../models/comment.model.js";
import Product from "../models/product.model.js";

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


export const createComment = async (req, res, next) => {
    const { productId, reviewId, text } = req.body;
    const userId = req.user._id;

    if (!productId) {
        return next(new AppError("Product ID is required", 400));
    }

    if (!text) {
        return next(new AppError("Text is required", 400));
    }

    const product = await Product.findById(productId).populate({
        path: 'reviews.comments',
        populate: {
            path: 'user',
            select: 'name email'
        }
    });

    if (!product) {
        return next(new AppError("Product Not Found", 404));
    }

    const newComment = await Comment.create({
        text,
        user: userId
    });

    product.reviews.comments.push(newComment._id);

    await product.save();

    res.status(201).json({
        success: true,
        comment: newComment
    });
};
