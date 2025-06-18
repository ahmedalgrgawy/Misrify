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
          from: "Review",  
          localField: "_id",
          foreignField: "product",
          as: "reviewArray"  
        }
      },
      {
        $project: {
          name: 1,
          totalReviews: { $size: "$reviewArray" },  // Get the number of reviews
          averageRating: {
            $cond: {
              if: { $gt: [{ $size: "$reviewArray" }, 0] },
              then: { $avg: "$reviewArray.rating" },
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
  