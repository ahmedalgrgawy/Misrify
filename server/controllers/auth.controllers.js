import AppError from "../errors/AppError.js";
import redis from "../lib/redis.js";
import User from "../models/user.model.js";
import { generateToken, storeTokenInCookies, storeTokenInRedis } from "../services/jwt.service.js";
import { sendWelcomeEmail } from "../services/nodemailer.service.js";
import { sendResetOtp, sendVerifyOtp } from "../services/otp.service.js";
import { generateOtp, generateResetPasswordOtp } from "../utils/generators.js";
import { validateCollegeEmail } from "../validators/validateCollegeEmail.js";

export const signup = async (req, res, next) => {
    const { name, email, password, phoneNumber, address, gender } = req.body;

    const isUserExist = await User.findOne({ email });

    if (isUserExist) {
        return next(new AppError("User Already Exist", 401))
    }

    const user = new User({ name, email, password, phoneNumber, address, gender });

    if (validateCollegeEmail(email)) {
        user.points = 100;
    }

    const { otp, otpExpiry } = generateOtp();

    user.otp = otp;
    user.otpExpiry = otpExpiry;

    // Check: send otp to email
    sendVerifyOtp(user.email, user.name, user.otp);

    const { accessToken, refreshToken } = generateToken(user._id);

    await storeTokenInRedis(user._id, refreshToken);

    storeTokenInCookies(res, accessToken, refreshToken);

    await user.save();

    user.password = undefined;
    user.otp = undefined;

    res.status(200).json({ success: true, message: "User Created Successfully", user })
}

export const verifyEmail = async (req, res, next) => {
    const { email, otp } = req.body;

    const user = await User.findOne({ email }).select('-password');

    if (!user) {
        return next(new AppError("User Does Not Exist", 401))
    }

    if (user.otpExpiry < Date.now()) {
        return next(new AppError("OTP Expired", 401))
    }

    if (user.otp !== otp) {
        return next(new AppError("Invalid OTP", 401))
    }

    user.otp = null;
    user.otpExpiry = null;

    user.isVerified = true;

    await user.save();

    await sendWelcomeEmail(user.email, user.name);

    res.status(200).json({ success: true, message: "Email Verified Successfully", user })
}

export const login = async (req, res) => {
    const { email, password } = req.body

    const user = await User.findOne({ email }).select('-password');

    if (!user) {
        next(new AppError("User Not Found", 401))
    }

    if (!user.isVerified) {
        next(new AppError("User Not Verified", 401))
    }

    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
        next(new AppError("Invalid Password", 401))
    }

    const { accessToken, refreshToken } = generateToken(user._id);

    await storeTokenInRedis(user._id, refreshToken);

    storeTokenInCookies(res, accessToken, refreshToken);

    res.status(200).json({ success: true, message: "User Logged In Successfully", user })
}

export const forgotPassword = async (req, res) => {
    const { email } = req.body

    const user = await User.findOne({ email });

    const { resetPasswordOtp, resetPasswordOtpExpiry } = generateResetPasswordOtp();

    user.resetPasswordOtp = resetPasswordOtp;
    user.resetPasswordOtpExpiry = resetPasswordOtpExpiry;

    await user.save();

    // TODO: send otp to email
    sendResetOtp(email, user.name, resetPasswordOtp);

    res.status(200).json({ success: true, message: "Reset Password OTP Sent Successfully" })
}

export const resetPassword = async (req, res) => {
    const { resetPasswordOtp, newPassword } = req.body

    const user = await User.findOne({
        resetPasswordOtp: resetPasswordOtp,
        resetPasswordOtpExpiry: { $gt: Date.now() }
    })

    if (!user) {
        res.status(401).json({ success: false, message: "Invalid OTP" })
    }

    user.password = newPassword;
    user.resetPasswordOtp = null;
    user.resetPasswordOtpExpiry = null;

    await user.save();

    res.status(200).json({ success: true, message: "Password Reset Successfully" })
}

export const logout = async (req, res) => {

    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
        const decodedToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

        await redis.del(`refreshToken_${decodedToken.userId}`);
    }

    res.clearCookie("accessToken");

    res.clearCookie("refreshToken");

    return res.status(200).json({ success: true, message: "Logged out successfully" });
}

export const reCreateAccessToken = async (req, res) => {

    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const decodedToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const storedToken = await redis.get(`refreshToken_${decodedToken.userId}`);

    if (refreshToken !== storedToken) {
        return res.status(401).json({ success: false, message: "Unauthorized, Invalid Refresh Token" });
    }

    const newAccessToken = jwt.sign({ userId: decodedToken.userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' })

    res.cookie('accessToken', newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7 * 1000
    })

    return res.status(200).json({ success: true, message: "Access Token Recreated" })
}

export const checkAuth = async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');

    if (!user) {
        return res.status(401).json({ success: false, message: "Unauthorized", user })
    }

    res.status(200).json({ success: true, message: "Authenticated", })
}