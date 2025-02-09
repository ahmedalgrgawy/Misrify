import AppError from "../errors/AppError.js";
import cloudinary from "../lib/cloudinary.js";
import Review from "../models/review.model.js";
import Product from "../models/product.model.js";
import Comment from "../models/comment.model.js";
import mongoose from "mongoose";

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

    try {
        const product = await Product.findById(productId);
        if (!product) {
            return next(new AppError("Product not found", 404));
        }

        const existingReview = await Review.findOne({ user: userId, product: productId });
        if (existingReview) {
            return next(new AppError("You have already reviewed this product", 400));
        }

        const review = await Review.create({ user: userId, product: productId, rating: ratingNumber, reviewText });

        res.status(201).json({ success: true, message: "Review created successfully", review });
    } catch (error) {
        next(new AppError("Error creating review", 500));
    }
};


export const updateReview = async (req, res, next) => {
    const { reviewId } = req.params;
    const { rating, reviewText } = req.body;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
        return next(new AppError("Invalid review ID", 400));
    }

    if (!rating && !reviewText) {
        return next(new AppError("At least one field (rating or reviewText) must be provided", 400));
    }

     const ratingNumber = Number(rating);
    if (rating && (isNaN(ratingNumber) || ratingNumber < 1 || ratingNumber > 5)) {
        return next(new AppError("Rating must be a number between 1 and 5", 400));
    }

    if (reviewText && !reviewText.trim()) {
        return next(new AppError("Review text cannot be empty", 400));
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

    try {
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
    } catch (error) {
        next(new AppError("Error deleting review", 500));
    }
};