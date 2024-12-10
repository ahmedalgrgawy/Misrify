import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User is required"],
    },
    code: {
        type: String,
        required: [true, "Code is required"],
        unique: true
    },
    discount: {
        type: Number,
        required: [true, "Discount is required"],
    },
    expirationDate: {
        type: Date,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    usedPoints: {
        type: Number,
        required: true,
    }
}, { timestamps: true })

const Coupon = mongoose.model("Coupon", couponSchema);

export default Coupon