import Product from "../models/product.model.js";
import Review from "../models/review.model.js";
import Order from "../models/order.model.js";  


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
              if: { $gt: ["$totalReviews", 0] },  
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
  
  export const getMerchantOrdersStats = async (req, res, next) => {
    const merchantId = req.user._id;  
  
    const result = await Order.aggregate([
      {
        $match: { merchant: merchantId }  
      },
      {
        $unwind: "$products" 
      },
      {
        $lookup: {
          from: "products",  
          localField: "products.product",  
          foreignField: "_id", 
          as: "productDetails"  
        }
      },
      {
        $unwind: "$productDetails" 
      },
      {
        $group: {
          _id: "$merchant",  
          totalOrders: { $sum: 1 }, 
          totalMoneyEarned: { $sum: { $multiply: ["$products.quantity", "$productDetails.price"] } } 
        }
      },
      {
        $project: {
          _id: 0,  // Don't include the _id in the output
          totalOrders: 1,  // Include the total number of orders
          totalMoneyEarned: 1  // Include the total money earned
        }
      }
    ]);
  
    // If no result, return 0 for both totalOrders and totalMoneyEarned
    if (result.length === 0) {
      return res.status(200).json({
        success: true,
        message: "Merchant has no orders yet",
        totalOrders: 0,
        totalMoneyEarned: 0
      });
    }
  
    res.status(200).json({
      success: true,
      message: "Orders stats fetched successfully",
      data: result[0],  // Return the stats for the merchant
    });
  };