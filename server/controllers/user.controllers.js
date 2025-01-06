import User from "../models/user.model.js"
import AppError from "../errors/AppError.js";
import cloudinary from "../lib/cloudinary.js";

export const getProfile = async (req, res) => {
    res.status(200).json({ success: true, user: req.user })
}

export const updateProfile = async (req, res, next) => {
    const userId = req.user.id;
    const { name, phoneNumber, address, currentPassword, newPassword } = req.body;
    let { imgUrl } = req.body;

    let user = await User.findById(userId);

    if (!user) {
        return next(new AppError("User Not Found", 404))
    }

    if ((!newPassword && currentPassword) || (!currentPassword && newPassword)) {
        return next(new AppError("Please provide both current password and new password", 400))
    }

    if (currentPassword && newPassword) {
        const isMatch = await user.comparePassword(currentPassword);

        if (!isMatch) {
            return next(new AppError("Current password is incorrect", 400))
        }

        user.password = newPassword;
    }

    if (imgUrl) {
        if (user.imgUrl) {
            await cloudinary.uploader.destroy(user.imgUrl.split("/").pop().split(".")[0]);
        }

        const uploadedResponse = await cloudinary.uploader.upload(imgUrl);
        imgUrl = uploadedResponse.secure_url;
    }

    user.name = name || user.name;
    user.phoneNumber = phoneNumber || user.phoneNumber;;
    user.address = address || user.address;;
    user.imgUrl = imgUrl || user.imgUrl;;

    user = await user.save();

    user.password = null;

    return res.status(200).json({ success: true, message: "Profile updated successfully", user });

}