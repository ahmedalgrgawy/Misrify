import mongoose from "mongoose";

const brandSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        unique: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Owner is required"],
    },
    description: {
        type: String,
        required: [true, "Description is required"],
    },
    imgUrl: {
        type: String,
    }
}, { timestamps: true })

const Brand = mongoose.model("Brand", brandSchema);

export default Brand