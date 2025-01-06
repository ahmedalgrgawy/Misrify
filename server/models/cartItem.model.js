import mongoose from "mongoose";

const cartItemsSchema = new mongoose.Schema({
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
})

const CartItem = mongoose.model("CartItem", cartItemsSchema);

export default CartItem