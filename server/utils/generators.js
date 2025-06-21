import crypto from "crypto"

export const generateOtp = () => {

    const otp = Math.floor(1000 + Math.random() * 9000)

    const otpExpiry = Date.now() + 10 * 60 * 1000 // 10 minutes

    return { otp, otpExpiry }
}

export const generateResetPasswordOtp = () => {

    const resetPasswordOtp = Math.floor(1000 + Math.random() * 9000)

    const resetPasswordOtpExpiry = Date.now() + 10 * 60 * 1000 // 10 minutes

    return { resetPasswordOtp, resetPasswordOtpExpiry }
}

export const calculateDiscount = (points) => {
    if (points < 50) {
        throw new Error("Minimum 50 points required to redeem a coupon");
    }

    // Example conversion logic (customize as needed)
    if (points >= 50 && points < 100) return 5;  // 50 points → $5 discount
    if (points >= 100 && points < 200) return 10; // 100 points → $10 discount
    if (points >= 200 && points < 500) return 12.5; // 200 points → $25 discount
    if (points >= 500) return 15;                 // 500+ points → $50 discount

    return 0; // Default case (should never reach here)
};

export const calculatePoints = (orderPrice) => {
    // Ensure price is a positive number
    if (typeof orderPrice !== 'number' || orderPrice < 0) {
        return 0;
    }

    // Define max price threshold for 50 points
    const maxPriceForMaxPoints = 100; // $100 = 50 points
    const pointsPerDollar = 50 / maxPriceForMaxPoints; // 0.5 points per dollar

    // Calculate points
    const points = orderPrice * pointsPerDollar;

    // Cap points at 50 and floor to integer
    return Math.min(Math.floor(points), 50);
};