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
                    from: "Review",  // Assuming the name of the reviews collection is 'Review'
                    localField: "_id",  // Field in the Product collection
                    foreignField: "product",  // Field in the Review collection
                    as: "reviews"  // The result will be an array of reviews for each product
                }
            },
            {
                $project: {
                    name: 1,  // Include the name of the product
                    totalReviews: { $size: "$reviews" },  // Count the number of reviews
                    averageRating: {
                        $cond: {
                            if: { $gt: [{ $size: "$reviews" }, 0] },  // Check if there are reviews
                            then: { $avg: "$reviews.rating" },  // Calculate the average rating
                            else: 0  // If there are no reviews, set the average to 0
                        }
                    }
                }
            }
        ]);

        // Return the response
        return res.status(200).json({
            success: true,
            message: "Products with their average ratings fetched successfully",
            products,
        });

    } catch (error) {
        return next(new AppError("Error fetching products and ratings", 500));  // Handle errors if any
    }
};