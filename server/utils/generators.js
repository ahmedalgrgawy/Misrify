import crypto from "crypto"

export const generateOtp = () => {

    const otp = Math.floor(1000 + Math.random() * 9000)

    const otpExpiry = Date.now() + 10 * 60 * 1000 // 10 minutes


    return { otp, otpExpiry }
}

export const generateResetPasswordOtp = () => {
    return {
        resetPasswordOtp: crypto.randomBytes(20).toString("hex"),
        resetPasswordOtpExpiry: Date.now() + 10 * 60 * 1000 // 10 minutes
    }
}