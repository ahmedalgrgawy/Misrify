import User from "../models/User.js";
import Order from "../models/Order.js";
import Review from "../models/Review.js";

export const getUserAnalytics = async (req, res, next) => {
    try {
        const userId = req.params.userId;

        // We can't use populate here — points and purchaseHistory are not refs
        const user = await User.findById(userId).select("points purchaseHistory");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Use populate to get user details inside each order (if needed)
        const orders = await Order.find({ user: userId })
            .select("totalPrice")
            .populate("user", "name email"); // Optional: if you want to display user's name/email

        const orderCount = orders.length;
        const totalMoneyPaid = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);

        // Use populate to get user details in reviews (if needed)
        const reviews = await Review.find({ user: userId })
            .select("rating")
            .populate("user", "name email"); // Optional

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
            purchaseHistory: user.purchaseHistory
        };

        res.status(200).json(analytics);


};
