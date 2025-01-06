import User from "../models/user.model.js"
import AppError from "../errors/AppError.js";
import cloudinary from "../lib/cloudinary.js";

// Any User
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

// Admins only
export const getAllUsers = async (req, res, next) => {
    const users = await User.find({ role: "user" }).select("-password");

    if (!users) {
        return next(new AppError("Error Finding Users", 404));
    }

    res.status(200).json({ success: true, users });
}

export const getAllMerchants = async (req, res, next) => {
    const merchants = await User.find({ role: "merchant" }).select("-password");

    if (!merchants) {
        return next(new AppError("Error Finding Merchants", 404));
    }

    res.status(200).json({ success: true, merchants });
}

export const createUser = async (req, res, next) => {
    const { name, email, password, phoneNumber, address, role, gender } = req.body

    const isUserExist = await User.findOne({ email });

    if (isUserExist) {
        return next(new AppError("User Already Exist", 401))
    }

    const user = new User({ name, email, password, phoneNumber, address, gender, role, isVerified: true });

    await user.save();

    res.status(201).json({ success: true, message: "User Created Successfully" })
}
export const editUser = async (req, res, next) => { }
export const deleteUser = async (req, res, next) => { }