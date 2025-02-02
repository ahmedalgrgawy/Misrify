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
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment",
        }
    ],
}, { timestamps: true })

const Review = mongoose.model("Review", reviewSchema);

export default Review