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
    const userId = req.user._id
    const { productId } = req.body

    // check if user has wishlist in db < if not create one and add the product >
    const wishlist = await Wishlist.findOne({ user: userId })

    if (!wishlist) {

        const newWishlist = await Wishlist.create({ user: userId })

        newWishlist.wishlistItems.push(productId)

        await newWishlist.save()

        return res.status(200).json({ success: true, message: "Product Added To Wishlist" })
    }

    console.log(wishlist)

    // Check if product is already in wishlist < if there then remove else add >
    if (wishlist.wishlistItems.includes(productId)) {

        wishlist.wishlistItems = wishlist.wishlistItems.filter((item) => item.toString() !== productId.toString())

        await wishlist.save()
        console.log(wishlist)
        return res.status(200).json({ success: true, message: "Product Removed From Wishlist" })
    }

    wishlist.wishlistItems.push(productId)
    await wishlist.save()

    res.status(200).json({ success: true, message: "Product Added To Wishlist" })
}