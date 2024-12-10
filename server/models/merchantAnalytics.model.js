import mongoose from "mongoose";

const merchantAnalyticsSchema = new mongoose.Schema({
    merchant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User is required"],
    },
    totalSales: {
        type: Number,
        default: 0,
    },
    totalProducts: {
        type: Number,
        default: 0,
    },
    totalOrders: {
        type: Number,
        default: 0,
    },
    stockLevels: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
        },
    ],
    avgRatings: {
        type: Number,
        default: 0
    },
    salesGrowth: {
        type: Number,
        default: 0
    }
}, { timestamps: true })

const MerchantAnalytics = mongoose.model("MerchantAnalytics", merchantAnalyticsSchema);

export default MerchantAnalytics;