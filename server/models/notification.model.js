import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  receivers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "At least one receiver is required"]
    }
  ],
  sender: {
    type: mongoose.Schema.Types.Mixed, // Allows either String or ObjectId
    required: [true, "Sender is required"],
    validate: {
      validator: function (value) {
        // Validate that sender is either "misrify Store" or a valid ObjectId
        return value === "Misrify Store" || mongoose.Types.ObjectId.isValid(value);
      },
      message: "Sender must be either 'misrify Store' or a valid admin ID"
    }
  },
  content: {
    type: String,
    required: [true, "Message is required"]
  },
  type: {
    type: String,
    enum: ["order", "product", "coupon", "category", "brand", "user", "general"],
    required: [true, "Type is required"]
  },
  isRead: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;