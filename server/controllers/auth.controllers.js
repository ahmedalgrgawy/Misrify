import redis from "../lib/redis.js";
import User from "../models/user.model.js";
import { generateToken, storeTokenInCookies, storeTokenInRedis } from "../services/jwt.service.js";
import { sendWelcomeEmail } from "../services/nodemailer.service.js";
import { sendResetOtp, sendVerifyOtp } from "../services/otp.service.js";
import { generateOtp, generateResetPasswordOtp } from "../utils/generators.js";
import { validateCollegeEmail, validateEmail } from "../utils/validation.js";

export const signup = async (req, res) => {
    try {
        const { name, email, password, phoneNumber, address, gender, points } = req.body;

        if (!validateEmail(email)) {
            res.status(401).json({ success: false, message: "Invalid Email" })
        }

        const isUserExist = await User.findOne({ email });

        if (isUserExist) {
            res.status(401).json({ success: false, message: "User Already Exist" })
        }

        if (validateCollegeEmail(email)) {
            points = 100;
        }

        const user = new User({ name, email, password, phoneNumber, address, gender, points });

        const { otp, otpExpiry } = generateOtp();

        user.otp = otp
        user.otpExpiry = otpExpiry

        // Check: send otp to email
        sendVerifyOtp(email, name, otp);

        const { accessToken, refreshToken } = generateToken(user._id);

        await storeTokenInRedis(user._id, refreshToken);

        storeTokenInCookies(res, accessToken, refreshToken);

        await user.save();

        res.status(200).json({ success: true, message: "User Created Successfully" })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Server Error", error: error.message })
    }
}

export const verifyEmail = async (req, res) => {
    try {
        const { otp } = req.body;

        if (!otp) {
            res.status(401).json({ success: false, message: "OTP is required" })
        }

        const user = await User.findOne({
            otp: otp,
            otpExpiry: { $gt: Date.now() }
        })

        if (!user) {
            res.status(401).json({ success: false, message: "Invalid OTP" })
        }

        user.otp = null;
        user.otpExpiry = null;
        user.isVerified = true;

        await user.save();

        await sendWelcomeEmail(user.email, user.name);

        res.status(200).json({ success: true, message: "Email Verified Successfully" })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Server Error", error: error.message })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            res.status(401).json({ success: false, message: "Email and Password are required" })
        }

        const user = await User.findOne({ email }).select('-password');

        if (!user) {
            res.status(401).json({ success: false, message: "User Not Found" })
        }

        if (!user.isVerified) {
            res.status(401).json({ success: false, message: "User Not Verified" })
        }

        const isPasswordMatch = await user.comparePassword(password);

        if (!isPasswordMatch) {
            res.status(401).json({ success: false, message: "Invalid Password" })
        }

        const { accessToken, refreshToken } = generateToken(user._id);

        await storeTokenInRedis(user._id, refreshToken);

        storeTokenInCookies(res, accessToken, refreshToken);

        res.status(200).json({ success: true, message: "User Logged In Successfully", user })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Server Error", error: error.message })
    }
}

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body

        const user = await User.findOne({ email });

        if (!user) {
            res.status(401).json({ success: false, message: "User Not Found" })
        }

        const { resetPasswordOtp, resetPasswordOtpExpiry } = generateResetPasswordOtp();

        user.resetPasswordOtp = resetPasswordOtp;
        user.resetPasswordOtpExpiry = resetPasswordOtpExpiry;

        await user.save();

        // TODO: send otp to email
        sendResetOtp(email, user.name, resetPasswordOtp);

        res.status(200).json({ success: true, message: "Reset Password OTP Sent Successfully" })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Server Error", error: error.message })
    }
}

export const resetPassword = async (req, res) => {
    try {
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

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Server Error", error: error.message })
    }
}

export const logout = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (refreshToken) {
            const decodedToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

            await redis.del(`refreshToken_${decodedToken.userId}`);
        }

        res.clearCookie("accessToken");

        res.clearCookie("refreshToken");

        return res.status(200).json({ success: true, message: "Logged out successfully" });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Server Error", error: error.message })
    }
}

export const reCreateAccessToken = async (req, res) => {
    try {

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

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Server Error", error: error.message })
    }
}

export const checkAuth = async (req, res) => {
    try {

        const user = await User.findById(req.user._id).select('-password');

        if (!user) {
            return res.status(401).json({ success: false, message: "Unauthorized", user })
        }

        res.status(200).json({ success: true, message: "Authenticated", })
    } catch (error) {

    }
}