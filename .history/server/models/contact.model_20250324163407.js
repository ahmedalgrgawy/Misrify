import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    message: { type: String, required: true },
}, { timestamps: true });

export const getAllMessages = asyncHandler(async (req, res) => {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json({
        success: true,
        count: messages.length,
        data: messages
    });
});

const Contact = mongoose.model("Contact", contactSchema);

export default Contact;
