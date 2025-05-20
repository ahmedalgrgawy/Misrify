import Contact from "../models/contact.model.js";
import AppError from "../errors/AppError.js";
import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";

export const submitContactForm = async (req, res, next) => {
    const { firstName, lastName, email, phone, message } = req.body;

    const newMessage = new Contact({ firstName, lastName, email, phone, message });
    await newMessage.save();

    // Notify Admins
    const admins = await User.find({ role: "admin" }).select("_id");

    await Notification.create({
        receivers: admins.map(admin => admin._id),
        sender: "Misrify Store",
        content: `New message from ${firstName} ${lastName}`,
        type: "general", // Now valid with updated schema
        isRead: false,
    });

    res.status(201).json({ success: true, message: "Message sent successfully" });
};
export const getAllMessages = async (req, res, next) => {
    const messages = await Contact.find().sort({ createdAt: -1 });

    if (!messages || messages.length === 0) {
        return next(new AppError("No contact messages found", 404));
    }

    res.status(200).json({ success: true, count: messages.length, data: messages });
};
