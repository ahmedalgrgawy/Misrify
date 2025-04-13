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
    try {
        const products = await Product.aggregate([
            {
                $lookup: {
                    from: "Review",
                    localField: "_id",
                    foreignField: "product",
                    as: "reviews"
                }
            },
            {
                $addFields: {
                    totalReviews: { $size: "$reviews" },
                    averageRating: {
                        $cond: [
                            { $gt: [{ $size: "$reviews" }, 0] },
                            { $avg: "$reviews.rating" },
                            0
                        ]
                    }
                }
            },
            {
                $project: {
                    name: 1,
                    totalReviews: 1,
                    averageRating: { $round: ["$averageRating", 2] }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            products
        });
    } catch (error) {
        next(error);
    }
};