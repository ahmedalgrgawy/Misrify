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
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: [true, "Product is required"],
            },
            quantity: {
                type: Number,
                required: [true, "Quantity is required"],
            },
            color: {
                type: String,
                required: [true, "Color is required"],
            },
            size: {
                type: String,
                required: [true, "Size is required"],
            },
            price: {
                type: Number,
                required: [true, "Price is required"],
            },
            total: {
                type: Number,
                required: [true, "Total is required"],
            }
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
        enum: ["pending", "success", "failed"],
    },
    totalPrice: {
        type: Number,
    }

}, { timestamps: true })

const Order = mongoose.model("Order", orderSchema);

export default Order