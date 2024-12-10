import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        unique: true
    },
    description: {
        type: String,
        required: [true, "Description is required"],
    }
})

const Category = mongoose.model("Category", categorySchema);

export default Category