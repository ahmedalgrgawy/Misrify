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
          localField: "reviews",  
          foreignField: "_id",  
          as: "reviewArray", 
        }
      },
      {
        $unwind: {  
          path: "$reviewArray", 
          preserveNullAndEmptyArrays: true 
        }
      },
      {
        $group: {  
          _id: "$_id",
          name: { $first: "$name" },
          totalReviews: { $sum: 1 },  
          averageRating: { $avg: "$reviewArray.rating" }, 
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
  