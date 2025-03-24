import Contact from "../models/contact.model.js";
import AppError from "../errors/AppError.js";

export const submitContactForm = async (req, res, next) => {
    try {
        const { firstName, lastName, email, phone, message } = req.body;

        const newMessage = new Contact({ firstName, lastName, email, phone, message });
        await newMessage.save();

        res.status(201).json({ success: true, message: "Message sent successfully" });
    } catch (error) {
        next(new AppError("Failed to send message", 500));
    }
};
