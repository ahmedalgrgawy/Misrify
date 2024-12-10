import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User is required"],
    },
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: [true, "Order is required"],
    },
    status: {
        type: String,
        enum: ["pending", "success", "failed"],
        default: "pending"
    },
    stripeId: {
        type: String,
        required: [true, "Stripe ID is required"],
    },
    methodId: {
        type: String, // Stores Stripe's payment method ID
        required: true,
    },
})

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment