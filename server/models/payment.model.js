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
    method: {
        type: String, // Stores payment method type (card, wallet, etc.)
        required: true,
    },
    paymentDetails: {
        transactionId: String,
        provider: {
            type: String,
            default: 'paymob'
        },
        amount: Number,
        currency: {
            type: String,
            default: 'EGP'
        },
        paymentDate: {
            type: Date,
            default: Date.now
        },
        paymobOrderId: String,
    }
}, { timestamps: true });

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment