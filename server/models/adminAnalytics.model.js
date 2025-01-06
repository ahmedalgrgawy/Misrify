import mongoose from "mongoose";

const adminAnalyticsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User is required"],
    },
    totalCategories: {
        type: Number,
        default: 0,
    },
    totalSales: {
        type: Number,
        default: 0,
    },
    totalUsers: {
        type: Number,
        default: 0,
    },
    totalProducts: {
        type: Number,
        default: 0,
    },
    totalBrands: {
        type: Number,
        default: 0
    },
    totalOrders: {
        type: Number,
        default: 0,
    }
}, { timestamps: true })

const AdminAnalytics = mongoose.model("AdminAnalytics", adminAnalyticsSchema);

export default AdminAnalytics