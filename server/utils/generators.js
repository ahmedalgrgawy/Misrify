import crypto from "crypto"

export const generateOtp = () => {
    return {
        otp: Math.floor(1000 + Math.random() * 9000),
        otpExpiry: Date.now() + 10 * 60 * 1000 // 10 minutes
    }
}

export const generateResetPasswordOtp = () => {
    return {
        resetPasswordOtp: crypto.randomBytes(20).toString("hex"),
        resetPasswordOtpExpiry: Date.now() + 10 * 60 * 1000 // 10 minutes
    }
}