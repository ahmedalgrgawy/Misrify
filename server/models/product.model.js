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
        min: [0, "Quantity cannot be negative"],
    },
    price: {
        type: Number,
        required: [true, "Price is required"],
        min: [0, "Price cannot be negative"],
    },
    colors: [
        {
            type: String,
            // enum: ["Red", "Green", "Blue", "Black", "White", "Yellow", "Pink", "Purple", "Orange", "Gray"],
            // required: [true, "Color is required"],
        }
    ],
    sizes: [
        {
            type: String,
            enum: ["XS", "S", "M", "L", "XL", "XXL"],
            // required: [true, "Size is required"],
        }
    ],
    imgUrl: {
        type: String,
    },
    isDiscounted: {
        type: Boolean,
        default: false,
    },
    discountAmount: {
        type: Number,
        default: 0,
        min: [0, "Discount cannot be negative"],
    },
    isApproved: {
        type: Boolean,
        default: false,
    },
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review"
        }
    ]
}, { timestamps: true });


const Product = mongoose.model("Product", productSchema);

export default Product;