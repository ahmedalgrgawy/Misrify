import mongoose from "mongoose";

const loginAttemptSchema = new mongoose.Schema({
    timestamp: {
        type: Date,
        default: Date.now
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true });

const LoginAttempt = mongoose.model("LoginAttempt", loginAttemptSchema);

export default LoginAttempt;
