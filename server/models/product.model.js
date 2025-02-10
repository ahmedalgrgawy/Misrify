import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: [true, "Category is required"],
    },
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Brand",
        required: [true, "Category is required"],
    },
    description: {
        type: String,
        required: [true, "Description is required"],
    },
    quantityInStock: {
        type: Number,
        required: [true, "Quantity is required"],
    },
    price: {
        type: Number,
        required: [true, "Price is required"],
    },
    colors: {
        type: [String],
    },
    sizes: {
        type: [String],
    },
    imgUrl: {
        type: String,
        required: [true, "Image is required"],
    },
    isDiscounted: {
        type: Boolean,
        default: false,
    },
    discountAmount: {
        type: Number,
        default: 0,
    },
    isApproved: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);

export default Product;