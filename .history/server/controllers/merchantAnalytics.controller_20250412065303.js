import Product from "../models/product.model.js";
import Review from "../models/review.model.js";

export const getStockLevel = async (req, res, next) => {
    const products = await Product.find().select("name quantityInStock");

    res.status(200).json({
        success: true,
        message: "Stock levels fetched successfully",
        products,
    });
};
