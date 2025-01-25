import Product from "../models/product.model";

export const getRequestedProducts = async (req, res) => {
    const RequestedProducts = await Product.find({ isApproved: false })
        .populate("category")
        .populate("brand")
        .populate("merchant")
        .exec();

    if (!RequestedProducts || RequestedProducts.length === 0) {
        return res.status(404).json({ success: false, message: "No Requested Products Found" })
    }

    res.status(200).json({ success: true, RequestedProducts })
}

export const getProducts = async (req, res) => {
    const Products = await Product.find({ isApproved: true })
        .populate("category")
        .populate("brand")
        .populate("merchant")
        .exec();

    if (!Products || Products.length === 0) {
        return res.status(404).json({ success: false, message: "No Products Found" })
    }

    res.status(200).json({ success: true, Products })
}