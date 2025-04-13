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
          from: "reviews",  // Correct collection name ("reviews" not "Review")
          localField: "reviews",  // Field from Product collection (array of review references)
          foreignField: "_id",  // Field in Review collection that matches the product's review references
          as: "reviewArray",  // This will store the reviews in the product document
        }
      },
      {
        $unwind: {  // Flatten the review array to calculate totalReviews and averageRating
          path: "$reviewArray", 
          preserveNullAndEmptyArrays: true  // Keep products with no reviews as well
        }
      },
      {
        $group: {  // Group by the product _id to re-aggregate reviews and calculate statistics
          _id: "$_id",
          name: { $first: "$name" },
          totalReviews: { $sum: 1 },  // Count the number of reviews
          averageRating: { $avg: "$reviewArray.rating" },  // Calculate the average rating
        }
      },
      {
        $project: {
          name: 1,
          totalReviews: 1,
          averageRating: {
            $cond: {
              if: { $gt: ["$totalReviews", 0] },  // If there are reviews, calculate the average
              then: "$averageRating",
              else: 0
            }
          }
        }
      }
    ]);
  
    res.status(200).json({
      success: true,
      message: "Products with their reviews count and average ratings fetched successfully",
      products,
    });
  };
  