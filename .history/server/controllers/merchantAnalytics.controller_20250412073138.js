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
          from: "reviews",  // Use the correct collection name (case-sensitive)
          localField: "_id", // Field from the Product collection (the product's _id)
          foreignField: "product",  // Field in the Review collection that links to Product
          as: "reviewArray"  // This will hold the reviews for each product
        }
      },
      {
        $project: {
          name: 1,  // Return the product name
          totalReviews: { $size: "$reviewArray" },  // Get the number of reviews
          averageRating: {
            $cond: {
              if: { $gt: [{ $size: "$reviewArray" }, 0] },  // Check if there are reviews
              then: { $avg: "$reviewArray.rating" },  // Calculate the average rating
              else: 0  // If no reviews, set average to 0
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
  