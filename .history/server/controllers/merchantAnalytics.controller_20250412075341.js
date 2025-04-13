import Product from "../models/product.model.js";
import Review from "../models/review.model.js";
import Order from "../models/order.model.js";  
import moment from "moment";


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
          _id: 0,  
          totalOrders: 1, 
          totalMoneyEarned: 1 
        }
      }
    ]);
  
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
      data: result[0], 
    });
  };

  export const getSalesGrowth = async (req, res, next) => {
        const userId = req.user._id;

        // Get the start and end dates for this month
        const startOfCurrentMonth = moment().startOf("month").toDate();
        const endOfCurrentMonth = moment().endOf("month").toDate();

        // Get the start and end dates for the previous month
        const startOfLastMonth = moment().subtract(1, "month").startOf("month").toDate();
        const endOfLastMonth = moment().subtract(1, "month").endOf("month").toDate();

        // Get total sales for the current month
        const currentMonthSales = await Order.aggregate([
            {
                $match: {
                    user: userId,
                    createdAt: { $gte: startOfCurrentMonth, $lte: endOfCurrentMonth }
                }
            },
            {
                $group: {
                    _id: null,
                    totalSales: { $sum: "$totalPrice" }
                }
            }
        ]);

        // Get total sales for the previous month
        const lastMonthSales = await Order.aggregate([
            {
                $match: {
                    user: userId,
                    createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth }
                }
            },
            {
                $group: {
                    _id: null,
                    totalSales: { $sum: "$totalPrice" }
                }
            }
        ]);

        const currentMonthTotal = currentMonthSales.length > 0 ? currentMonthSales[0].totalSales : 0;
        const lastMonthTotal = lastMonthSales.length > 0 ? lastMonthSales[0].totalSales : 0;

        // Calculate the sales growth rate
        let salesGrowthRate = 0;
        if (lastMonthTotal > 0) {
            salesGrowthRate = ((currentMonthTotal - lastMonthTotal) / lastMonthTotal) * 100;
        }

        res.status(200).json({
            success: true,
            message: "Sales growth data fetched successfully",
            currentMonthTotal,
            lastMonthTotal,
            salesGrowthRate: salesGrowthRate.toFixed(2),
        });
   
};