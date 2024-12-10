import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User is required"],
    },
    cartItems: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "CartItem",
        }
    ],
    totalPrice: {
        type: Number,
    }
}, { timestamps: true })

const Cart = mongoose.model("Cart", cartSchema);

export default Cart