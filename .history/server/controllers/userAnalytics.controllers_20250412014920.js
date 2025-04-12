import User from "../models/user.model.js";
import Order from "../models/order.model.js";
import Review from "../models/review.model.js";
import AppError from "../errors/AppError.js";

export const getUserAnalytics = async (req, res, next) => {
        const userId = req.params.userId;

        const user = await User.findById(userId).select("points purchaseHistory");
        if (!user) {
            return next(new AppError("User not found", 404));
        }

        const orders = await Order.find({ user: userId }).select("totalPrice");
        const orderCount = orders.length;
        const totalMoneyPaid = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);

        const reviews = await Review.find({ user: userId }).select("rating");
        const totalReviews = reviews.length;
        const averageRating = totalReviews > 0
            ? (reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews).toFixed(2)
            : 0;

        const analytics = {
            orderCount,
            totalReviews,
            averageRating: parseFloat(averageRating),
            totalPoints: user.points,
            totalMoneyPaid,
            purchaseHistory: user.purchaseHistory,
        };

        return res.status(200).json({
            success: true,
            message: "User analytics fetched successfully",
            analytics,
        });

};
