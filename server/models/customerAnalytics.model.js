import mongoose from "mongoose";

const customerAnalyticsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User is required"],
    },
    totalReviews: {
        type: Number,
        default: 0,
    },
    totalSpending: {
        type: Number,
        default: 0,
    },
    totalOrders: {
        type: Number,
        default: 0,
    },
    pointsEarned: {
        type: Number,
        default: 0,
    },
}, { timestamps: true })

const CustomerAnalytics = mongoose.model("CustomerAnalytics", customerAnalyticsSchema);

export default CustomerAnalytics