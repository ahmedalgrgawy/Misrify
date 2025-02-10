import AppError from "../errors/AppError.js";
import cloudinary from "../lib/cloudinary.js";
import Review from "../models/review.model.js";
import Product from "../models/product.model.js";
import Comment from "../models/comment.model.js";

export const createReview = async (req, res, next) => {
    const { productId, rating, reviewText } = req.body;
    const userId = req.user._id; 

    if (!productId || !rating || !reviewText) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const ratingNumber = Number(rating);
    if (isNaN(ratingNumber) || ratingNumber < 1 || ratingNumber > 5) {
        return res.status(400).json({ success: false, message: "Rating must be a number between 1 and 5" });
    }

    if (!reviewText.trim()) {
        return res.status(400).json({ success: false, message: "Review text cannot be empty" });
    }

    const product = await Product.findById(productId);
    if (!product) {
        return res.status(404).json({ success: false, message: "Product not found" });
    }

    const existingReview = await Review.findOne({ user: userId, product: productId });
    if (existingReview) {
        return res.status(400).json({ success: false, message: "You have already reviewed this product" });
    }

    const review = await Review.create({ user: userId, product: productId, rating: ratingNumber, reviewText });

    res.status(201).json({ success: true, message: "Review created successfully", review });
};


export const updateReview = async (req, res, next) => {
    const { reviewId } = req.params;
    const { rating, reviewText } = req.body;
    const userId = req.user._id;

    if (!mongoose.isValidObjectId(reviewId)) {
        return res.status(400).json({ success: false, message: "Invalid review ID" });
    }

    if (!rating && !reviewText) {
        return res.status(400).json({ success: false, message: "At least one field (rating or reviewText) must be provided" });
    }

    const ratingNumber = Number(rating);
    if (rating && (isNaN(ratingNumber) || ratingNumber < 1 || ratingNumber > 5)) {
        return res.status(400).json({ success: false, message: "Rating must be a number between 1 and 5" });
    }

    if (reviewText && !reviewText.trim()) {
        return res.status(400).json({ success: false, message: "Review text cannot be empty" });
    }

    const review = await Review.findById(reviewId);
    if (!review) {
        return res.status(404).json({ success: false, message: "Review not found" });
    }

    if (review.user.toString() !== userId.toString()) {
        return res.status(403).json({ success: false, message: "Unauthorized: You can only edit your own reviews" });
    }

    if (rating) 
        review.rating = ratingNumber;
    if (reviewText) 
        review.reviewText = reviewText;

    await review.save();

    res.status(200).json({ success: true, message: "Review updated successfully", review });
};


export const deleteReview = async (req, res, next) => { 
    const { reviewId } = req.params;
    const userId = req.user._id;

    const review = await Review.findById(reviewId);

    if (!review) {
        return res.status(404).json({ success: false, message: "Review not found" });
    }

    if (review.user.toString() !== userId.toString()) {
        return res.status(403).json({ success: false, message: "Unauthorized: You can only delete your own reviews" });
    }

    if (review.comments.length > 0) {
        await Comment.deleteMany({ _id: { $in: review.comments } });
    }

    await review.deleteOne();

    res.status(200).json({ success: true, message: "Review deleted successfully" });
};