import AppError from "../errors/AppError.js"
import Wishlist from "../models/wishlist.model.js"

export const getWishlist = async (req, res, next) => {

    const userId = req.user._id

    const wishlist = await Wishlist.findOne({ user: userId }).populate("wishlistItems").exec()

    if (!wishlist) return next(new AppError("Wishlist Not Found", 404))

    if (wishlist.wishlistItems.length === 0) return next(new AppError("Wishlist Is Empty", 404))

    res.status(200).json({ success: true, wishlist })
}

export const toggleWishlist = async (req, res, next) => {

}