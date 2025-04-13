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
                from: "Riev",  
                localField: "_id",
                foreignField: "product",
                as: "reviews"
            }
        },
        {
            $project: {
                name: 1,
                totalReviews: { $size: "$reviews" },
                averageRating: {
                    $cond: {
                        if: { $gt: [{ $size: "$reviews" }, 0] },
                        then: {
                            $avg: {
                                $map: {
                                    input: "$reviews",
                                    as: "review",
                                    in: { $toDouble: "$$review.rating" }  // Ensure the rating is treated as a number
                                }
                            }
                        },
                        else: 0
                    }
                }
            }
        }
    ]);

    res.status(200).json({
        success: true,
        message: "Products and their average ratings fetched successfully",
        products,
    });
};
