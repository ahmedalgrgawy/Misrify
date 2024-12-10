import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User is required"],
    },
    cartItems: [
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
    totalPrice: {
        type: Number,
    }
}, { timestamps: true })

const Cart = mongoose.model("Cart", cartSchema);

export default Cart