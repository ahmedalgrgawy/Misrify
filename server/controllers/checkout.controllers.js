import AppError from "../errors/AppError.js";
import User from "../models/user.model.js"
import { v4 as uuidv4 } from "uuid"; // To generate unique coupon codes
import { calculateDiscount } from "../utils/generators.js";
import Coupon from "../models/coupon.model.js";


export const getCoupons = async (req, res, next) => {
    const coupons = await Coupon.find({ user: req.user._id });

    if (!coupons) {
        return next(new AppError("User Does Not Have Coupons yet", 404))
    }

    res.status(200).json({ message: "User Coupons", coupons })
}

export const exchangePointsForCoupon = async (req, res, next) => {

    const { points } = req.body;

    if (!points) {
        return next(new AppError("Points must be Provided", 400))
    }

    const user = await User.findById(req.user._id)

    if (user.points < points) {
        return next(new AppError("Not enough points", 400))
    }

    const discountValue = calculateDiscount(points);

    user.points -= points;
    await user.save();

    const coupon = new Coupon({
        user: user._id,
        code: uuidv4(), // Generates a unique coupon code
        discount: discountValue,
        expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Expires in 30 days
        usedPoints: points
    });

    await coupon.save();

    return res.status(200).json({
        message: "Coupon Created Successfully",
        coupon,
        discountValue
    })

}