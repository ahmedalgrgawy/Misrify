import AppError from "../errors/AppError.js";
import Notification from "../models/notification.model.js";

export const getNotifications = async (req, res, next) => {
    const notifications = await Notification.find({
        receiver: {
            $in: req.user._id
        },
        isRead: false
    }).populate("sender", "name role").sort({ createdAt: -1 });

    if (!notifications) {
        return next(new AppError("No Notifications Found", 404))
    }

    res.status(200).json({
        message: "success",
        notifications
    })

}

export const markAsRead = async (req, res, next) => {
    const { id } = req.params;

    const notification = await Notification.findByIdAndUpdate(id, { isRead: true }, { new: true });

    if (!notification) {
        return next(new AppError("Notification not found", 404))
    }

    res.status(200).json({
        message: "Make as read successfully",
    })
}

export const deleteNotification = async (req, res, next) => {
    const { id } = req.params;

    const notification = await Notification.findByIdAndDelete(id);

    if (!notification) {
        return next(new AppError("Notification not found", 404))
    }

    res.status(200).json({
        message: "Notification deleted successfully",
    })
}

export const deleteAllNotification = async (req, res) => {
    const notifications = await Notification.deleteMany({
        receiver: {
            $in: req.user._id
        }
    })

    if (!notifications) {
        return next(new AppError("No Notifications Found", 404))
    }

    res.status(200).json({
        message: "All Notifications deleted successfully",
    })
}