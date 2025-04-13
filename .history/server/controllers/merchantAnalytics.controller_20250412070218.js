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

export const getProductsWithAvgRatings = async (req, res, next) => {
    const products = await Product.aggregate([
        {
            $lookup: {
                from: "reviews",  
                localField: "_id",
                foreignField: "product",
                as: "reviews"
            }
        },
        {
            $project: {
                name: 1,
                totalReviews: { $size: "$reviews" },
                reviews: 1  // Log reviews to inspect them
            }
        }
    ]);

    console.log(products); // Log the products and reviews data

    res.status(200).json({
        success: true,
        message: "Products and their average ratings fetched successfully",
        products,
    });
};
