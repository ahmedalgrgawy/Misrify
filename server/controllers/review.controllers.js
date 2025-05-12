import AppError from "../errors/AppError.js";
import Review from "../models/review.model.js";
import Product from "../models/product.model.js";
import Comment from "../models/comment.model.js";
import Notification from "../models/notification.model.js";

export const createReview = async (req, res, next) => {
    const { productId, rating, reviewText } = req.body;
    const userId = req.user._id;

    const product = await Product.findById(productId);

    if (!product) {
        return next(new AppError("Product not found", 404));
    }

    const existingReview = await Review.findOne({ user: userId, product: productId });

    if (existingReview) {
        return next(new AppError("You have already reviewed this product", 400));
    }

    const review = await Review.create({ user: userId, product: productId, rating: rating, reviewText });

    product.reviews.push(review._id);

    await product.save();

    await Notification.create({
        title: "New Review",
        message: `New review on your product`,
        receiver: product.merchant,
        sender: userId,
        type: "product",
        isRead: false,
    })

    res.status(201).json({ success: true, message: "Review created successfully", review });

};

export const updateReview = async (req, res, next) => {
    const { reviewId } = req.params;
    const { rating, reviewText } = req.body;

    const userId = req.user._id;

    // if (!mongoose.Types.ObjectId.isValid(reviewId)) {
    //     return next(new AppError("Invalid review ID", 400));
    // }

    const review = await Review.findById(reviewId);

    if (!review) {
        return res.status(404).json({ success: false, message: "Review not found" });
    }

    if (review.user.toString() !== userId.toString()) {
        return res.status(403).json({ success: false, message: "Unauthorized: You can only edit your own reviews" });
    }

    review.rating = rating || review.rating;
    review.reviewText = reviewText || review.reviewText;;

    await review.save();

    res.status(200).json({ success: true, message: "Review updated successfully", review });
};


export const deleteReview = async (req, res, next) => {
    const { reviewId } = req.params;
    const userId = req.user._id;

    const review = await Review.findById(reviewId);

    if (!review) {
        return next(new AppError("Review not found", 404));
    }

    if (review.user.toString() !== userId.toString()) {
        return next(new AppError("Unauthorized: You can only delete your own reviews", 403));
    }

    if (review.comments.length > 0) {
        await Comment.deleteMany({ _id: { $in: review.comments } });
    }

    await review.deleteOne();

    res.status(200).json({ success: true, message: "Review deleted successfully" });
};