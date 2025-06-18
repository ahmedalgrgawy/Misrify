import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    text: {
      type: String,
      required: [true, "Comment text is required"],
      trim: true,
      minlength: [3, "Comment must be at least 3 characters long"]
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"]
    },
    reviewId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
      required: true
    }
  }, { timestamps: true });
  
  const Comment = mongoose.model("Comment", commentSchema);
  export default Comment;
  