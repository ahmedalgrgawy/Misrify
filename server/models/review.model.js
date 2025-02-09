import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User is required"],
    },
    rating: {
        type: Number,
        required: [true, "Rating is required"],
        min: [1, "Rating must be at least 1"],
        max: [5, "Rating must be at most 5"],
        validate: {
            validator: Number.isInteger,
            message: "Rating must be an integer",
        },
    },
    reviewText: {
        type: String,
        required: [true, "Review text is required"],
        trim: true,
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment",
        }
    ]
}, { timestamps: true })


const Review = mongoose.model("Review", reviewSchema);

export default Review