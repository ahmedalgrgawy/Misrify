import User from "../models/user.model.js";
import Order from "../models/order.model.js";
import Review from "../models/review.model.js";
import AppError from "../errors/AppError.js";

export const getUserAnalytics = async (req, res, next) => {
    const userId = req.params.userId;
    const include = req.query.include?.split(',') || ['orders', 'reviews', 'points', 'purchaseHistory'];

    const user = await User.findById(userId).select("points purchaseHistory");
    if (!user) {
        return next(new AppError("User not found", 404));
    }

    const analytics = {};

    // Orders
    if (include.includes('orders')) {
        const orders = await Order.find({ user: userId }).select("totalPrice");
        analytics.orderCount = orders.length;
        analytics.totalMoneyPaid = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
    }

    // Reviews
    if (include.includes('reviews')) {
        const reviews = await Review.find({ user: userId }).select("rating");
        const totalReviews = reviews.length;
        const averageRating = totalReviews > 0
            ? (reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews).toFixed(2)
            : 0;
        analytics.totalReviews = totalReviews;
        analytics.averageRating = parseFloat(averageRating);
    }

    // Points
    if (include.includes('points')) {
        analytics.totalPoints = user.points;
    }

     // Purchase History
     if (include.includes('purchaseHistory')) {
        const populatedPurchaseHistory = await Order.find({ '_id': { $in: user.purchaseHistory } })
            .populate({
                path: 'orderItems',
                populate: {
                    path: 'product',
                    select: 'name price image' 
                }
            })
            .populate('coupon', 'code discount');

        analytics.purchaseHistory = populatedPurchaseHistory;
    }

    res.status(200).json({
        success: true,
        message: "User analytics fetched successfully",
        analytics,
    });
};
