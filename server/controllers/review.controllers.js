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

    if (!product.owner) {
        console.warn(`⚠️ Product ${productId} has no owner. Skipping notification.`);
    } else {
        await Notification.create({
            receiver: [product.owner],
            sender: req.user.id,
            type: 'product',
            content: `New review added to product ${product.name}`,
        });
    }

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

export const getMerchantReviews = async (req, res, next) => {
    try {
        const merchantId = req.user._id;

        const reviews = await Product.aggregate([
            // Step 1: Lookup merchant's brands
            {
                $lookup: {
                    from: "brands",
                    let: { merchantId: merchantId },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$owner", "$$merchantId"] } } },
                        { $project: { _id: 1 } },
                    ],
                    as: "merchantBrands",
                },
            },
            // Step 2: Match products for those brands
            {
                $match: {
                    $expr: { $in: ["$brand", "$merchantBrands._id"] },
                },
            },
            // Step 3: Unwind reviews array
            { $unwind: "$reviews" },
            // Step 4: Lookup review details
            {
                $lookup: {
                    from: "reviews",
                    let: { reviewId: "$reviews" },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$_id", "$$reviewId"] } } },
                        {
                            $lookup: {
                                from: "users",
                                localField: "user",
                                foreignField: "_id",
                                as: "user",
                            },
                        },
                        { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
                        {
                            $lookup: {
                                from: "comments",
                                localField: "comments",
                                foreignField: "_id",
                                as: "comments",
                                pipeline: [
                                    {
                                        $lookup: {
                                            from: "users",
                                            localField: "user",
                                            foreignField: "_id",
                                            as: "user",
                                        },
                                    },
                                    { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
                                    {
                                        $project: {
                                            _id: 1,
                                            text: 1,
                                            createdAt: 1,
                                            user: { _id: 1, name: 1, email: 1 },
                                        },
                                    },
                                ],
                            },
                        },
                        {
                            $project: {
                                _id: 1,
                                rating: 1,
                                reviewText: 1,
                                createdAt: 1,
                                user: { _id: 1, name: 1, email: 1 },
                                comments: 1,
                            },
                        },
                    ],
                    as: "review",
                },
            },
            { $unwind: "$review" },
            // Step 5: Project final output
            {
                $project: {
                    _id: "$review._id",
                    rating: "$review.rating",
                    reviewText: "$review.reviewText",
                    createdAt: "$review.createdAt",
                    user: "$review.user",
                    comments: "$review.comments",
                    product: { _id: "$_id", name: "$name", imgUrl: "$imgUrl" },
                },
            },
        ]);

        res.status(200).json({ success: true, reviews });
    } catch (error) {
        console.error("Aggregation error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch reviews" });
    }
};