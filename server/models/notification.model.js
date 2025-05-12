import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    receiver: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Receiver is required"],
        }
    ],
    sender: {
        type: [{
            type: String,
            enum: ["admin", "Misrify"]
        }, {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }],
        default: "Misrify",
    },
    content: {
        type: String,
        required: [true, "Message is required"],
    },
    type: {
        type: String,
        enum: ["order", "product", "coupon", "category", "brand", "user", "general"],
        required: [true, "Type is required"],
    },
    isRead: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;