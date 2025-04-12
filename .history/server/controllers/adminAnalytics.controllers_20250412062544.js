import Category from "../models/category.model.js";
import Brand from "../models/brand.model.js";
import Product from "../models/product.model.js";

export const getPlatformStats = async (req, res, next) => {
    const totalCategories = await Category.countDocuments();
    const totalBrands = await Brand.countDocuments();
    const totalProducts = await Product.countDocuments();

    res.status(200).json({
        success: true,
        message: "Platform stats fetched successfully",
        stats: {
            totalCategories,
            totalBrands,
            totalProducts,
        }
    });
};

