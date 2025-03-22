import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User is required"],
    },
    coupon: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Coupon",
    },
    orderItems: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "OrderItem",
        }
    ],
    shippingAddress: {
        type: String,
        required: [true, "Shipping address is required"],
    },
    shippingMethod: {
        type: String,
    },
    trackCode: {
        type: String,
        required: [true, "Tracking code is required"],
    },
    status: {
        type: String,
        enum: ["pending", "paid", "unpaid", "shipped", "delivered", "cancelled"],
        default: "pending",
    },
    totalPrice: {
        type: Number,
    }

}, { timestamps: true })

const Order = mongoose.model("Order", orderSchema);

export default Order