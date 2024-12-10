import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User is required"],
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: [true, "Product is required"],
    },
    rating: {
        type: Number,
    },
    text: {
        type: String,
        required: [true, "Text is required"],
    },
    comments: [
        {
            text: {
                type: String,
                required: true,
            },
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true,
            }
        }
    ],
}, { timestamps: true })

const Review = mongoose.model("Review", reviewSchema);

export default Review