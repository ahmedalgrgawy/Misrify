import AppError from "../errors/AppError.js";
import Notification from "../models/notification.model.js";

export const getNotifications = async (req, res, next) => {
    const notifications = await Notification.find({
        receivers: {
            $in: [req.user._id] // Updated to receivers
        },
        // isRead: false
    })
        .populate({
            path: "sender",
            select: "name role",
            match: { $or: [{ name: { $exists: true } }, { _id: { $exists: true } }] } // Handle both String and ObjectId
        })
        .sort({ createdAt: -1 });

    if (!notifications || notifications.length === 0) {
        return next(new AppError("No Notifications Found", 404))
    }

    res.status(200).json({
        message: "success",
        notifications
    })
}

export const markAsRead = async (req, res, next) => {
    const { id } = req.params;

    const notification = await Notification.findOneAndUpdate(
        { _id: id, receivers: { $in: [req.user._id] } }, // Updated to receivers
        { isRead: true },
        { new: true }
    );

    if (!notification) {
        return next(new AppError("Notification not found", 404))
    }

    res.status(200).json({
        message: "Marked as read successfully",
    })
}

export const deleteNotification = async (req, res, next) => {
    const { id } = req.params;

    const notification = await Notification.findOneAndDelete({
        _id: id,
        receivers: { $in: [req.user._id] } // Updated to receivers
    });

    if (!notification) {
        return next(new AppError("Notification not found", 404))
    }

    res.status(200).json({
        message: "Notification deleted successfully",
    })
}

export const deleteAllNotifications = async (req, res, next) => {
    const notifications = await Notification.deleteMany({
        receivers: { $in: [req.user._id] } // Updated to receivers
    });

    if (notifications.deletedCount === 0) {
        return next(new AppError("No Notifications Found", 404))
    }

    res.status(200).json({
        message: "All Notifications deleted successfully",
    })
}