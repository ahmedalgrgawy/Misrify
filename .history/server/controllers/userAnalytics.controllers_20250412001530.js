// controllers/userAnalyticsController.js
import User from "../models/User.js";
import Order from "../models/Order.js";
import Review from "../models/Review.js";

export const getUserAnalytics = async (req, res, next) => {
    try {
        const userId = req.params.userId;

        // Get user (only fields we care about)
        const user = await User.findById(userId).select("points purchaseHistory");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Orders count and total money paid
        const orders = await Order.find({ user: userId }).select("totalPrice");
        const orderCount = orders.length;
        const totalMoneyPaid = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);

        // Reviews count and average rating
        const reviews = await Review.find({ user: userId }).select("rating");
        const totalReviews = reviews.length;
        const averageRating = totalReviews > 0 
            ? (reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews).toFixed(2)
            : 0;

        // Build analytics response
        const analytics = {
            orderCount,
            totalReviews,
            averageRating: parseFloat(averageRating),
            totalPoints: user.points,
            totalMoneyPaid,
            purchaseHistory: user.purchaseHistory
        };

        res.status(200).json(analytics);

    } catch (error) {
        next(error);
    }
};
