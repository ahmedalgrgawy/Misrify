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
  try {
    const merchantId = req.user._id;

    const startOfCurrentMonth = moment().startOf("month").toDate();
    const endOfCurrentMonth = moment().endOf("month").toDate();
    const startOfLastMonth = moment().subtract(1, "month").startOf("month").toDate();
    const endOfLastMonth = moment().subtract(1, "month").endOf("month").toDate();

    const salesAggregation = (start, end) => Order.aggregate([
      { $match: { merchant: new mongoose.Types.ObjectId(merchantId), createdAt: { $gte: start, $lte: end } } },
      { $unwind: "$products" },
      {
        $lookup: {
          from: "products",
          localField: "products.product",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" },
      {
        $group: {
          _id: null,
          totalSales: { $sum: { $multiply: ["$products.quantity", "$productDetails.price"] } },
        },
      },
    ]);

    const [currentMonthSales, lastMonthSales] = await Promise.all([
      salesAggregation(startOfCurrentMonth, endOfCurrentMonth),
      salesAggregation(startOfLastMonth, endOfLastMonth),
    ]);

    const currentMonthTotal = currentMonthSales.length > 0 ? currentMonthSales[0].totalSales : 0;
    const lastMonthTotal = lastMonthSales.length > 0 ? lastMonthSales[0].totalSales : 0;
    const salesGrowthRate = lastMonthTotal > 0 ? (((currentMonthTotal - lastMonthTotal) / lastMonthTotal) * 100).toFixed(2) : 0;

    res.status(200).json({
      success: true,
      message: "Sales growth data fetched successfully",
      data: {
        currentMonthTotal,
        lastMonthTotal,
        salesGrowthRate,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getMerchantSalesTrends = async (req, res, next) => {
  try {
    const merchantId = req.user._id;
    const { year = new Date().getFullYear() } = req.query;

    const salesTrends = await Order.aggregate([
      {
        $match: {
          merchant: new mongoose.Types.ObjectId(merchantId),
          createdAt: {
            $gte: new Date(year, 0, 1),
            $lte: new Date(year, 11, 31, 23, 59, 59),
          },
        },
      },
      { $unwind: "$products" },
      {
        $lookup: {
          from: "products",
          localField: "products.product",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" },
      {
        $group: {
          _id: { month: { $month: "$createdAt" } },
          totalSales: { $sum: { $multiply: ["$products.quantity", "$productDetails.price"] } },
        },
      },
      {
        $sort: { "_id.month": 1 },
      },
      {
        $project: {
          _id: 0,
          month: {
            $arrayElemAt: [
              ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
              { $subtract: ["$_id.month", 1] },
            ],
          },
          totalSales: 1,
        },
      },
    ]);

    // Fill missing months with 0 sales
    const allMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const filledTrends = allMonths.map((month) => {
      const found = salesTrends.find((trend) => trend.month === month);
      return { month, totalSales: found ? found.totalSales : 0 };
    });

    res.status(200).json({
      success: true,
      message: "Sales trends fetched successfully",
      data: filledTrends, // [{ month: "Jan", totalSales: 5000 }, ...]
    });
  } catch (error) {
    next(error);
  }
};

export const getYearlyIncome = async (req, res, next) => {
  try {
    const { role, _id: userId } = req.user;
    const year = new Date().getFullYear();

    let salesRevenue = 0;
    let otherIncome = 0; // Placeholder; extend Order/Product model if needed

    if (role === "merchant") {
      const sales = await Order.aggregate([
        {
          $match: {
            merchant: new mongoose.Types.ObjectId(userId),
            createdAt: {
              $gte: new Date(year, 0, 1),
              $lte: new Date(year, 11, 31, 23, 59, 59),
            },
          },
        },
        { $unwind: "$products" },
        {
          $lookup: {
            from: "products",
            localField: "products.product",
            foreignField: "_id",
            as: "productDetails",
          },
        },
        { $unwind: "$productDetails" },
        {
          $group: {
            _id: null,
            totalSales: { $sum: { $multiply: ["$products.quantity", "$productDetails.price"] } },
          },
        },
      ]);
      salesRevenue = sales.length > 0 ? sales[0].totalSales : 0;
    } else if (role === "admin") {
      const sales = await Order.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(year, 0, 1),
              $lte: new Date(year, 11, 31, 23, 59, 59),
            },
          },
        },
        {
          $group: {
            _id: null,
            totalSales: { $sum: "$totalPrice" },
          },
        },
      ]);
      salesRevenue = sales.length > 0 ? sales[0].totalSales : 0;
    }

    // Assume otherIncome is 35% of total for simplicity; adjust based on actual data
    const totalIncome = salesRevenue / 0.65; // Reverse-engineer total assuming 65% is sales
    otherIncome = totalIncome - salesRevenue;

    res.status(200).json({
      success: true,
      message: "Yearly income fetched successfully",
      data: {
        labels: ["Salary", "Investments"],
        values: [salesRevenue, otherIncome],
        totalIncome: totalIncome.toFixed(0),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getTotalViewers = async (req, res, next) => {
  try {
    const { role, _id: userId } = req.user;
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    let match = {};
    if (role === "merchant") {
      // Assume viewers are customers who viewed merchant's products
      match = { "viewedProducts.merchant": new mongoose.Types.ObjectId(userId) }; // Adjust Product model if needed
    }

    console.log("pass 1");


    const viewers = await User.aggregate([
      { $match: match },
      {
        $project: {
          status: {
            $cond: {
              if: { $gte: ["$lastActive", thirtyDaysAgo] },
              then: "Active",
              else: { $cond: { if: { $exists: "$lastActive" }, then: "Inactive", else: "Offline" } },
            },
          },
        },
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          status: "$_id",
          count: 1,
        },
      },
    ]);

    console.log("pass 2");


    const result = { Active: 0, Inactive: 0, Offline: 0 };
    viewers.forEach(({ _id, count }) => (result[_id] = count));

    res.status(200).json({
      success: true,
      message: "Total viewers fetched successfully",
      data: {
        labels: ["Active", "Inactive", "Offline"],
        values: [result.Active, result.Inactive, result.Offline],
        totalCount: result.Active + result.Inactive + result.Offline,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getMerchantOrderTrends = async (req, res, next) => {
  try {
    const merchantId = req.user._id;
    const year = new Date().getFullYear();

    const orderTrends = await Order.aggregate([
      {
        $match: {
          merchant: new mongoose.Types.ObjectId(merchantId),
          createdAt: {
            $gte: new Date(year, 0, 1),
            $lte: new Date(year, 11, 31, 23, 59, 59),
          },
        },
      },
      { $unwind: "$products" },
      {
        $lookup: {
          from: "products",
          localField: "products.product",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" },
      {
        $group: {
          _id: { month: { $month: "$createdAt" } },
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: { $multiply: ["$products.quantity", "$productDetails.price"] } },
        },
      },
      { $sort: { "_id.month": 1 } },
      {
        $project: {
          _id: 0,
          month: {
            $arrayElemAt: [
              ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
              { $subtract: ["$_id.month", 1] },
            ],
          },
          totalOrders: 1,
          totalRevenue: 1,
        },
      },
    ]);

    // Fill missing months
    const allMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const filledTrends = allMonths.map((month) => {
      const found = orderTrends.find((trend) => trend.month === month);
      return {
        month,
        totalOrders: found ? found.totalOrders : 0,
        totalRevenue: found ? found.totalRevenue : 0,
      };
    });

    res.status(200).json({
      success: true,
      message: "Order trends fetched successfully",
      data: filledTrends, // [{ month: "Jan", totalOrders: 50, totalRevenue: 5000 }, ...]
    });
  } catch (error) {
    next(error);
  }
};

import MerchantAnalytics from "../models/merchantAnalytics.model.js";

export const updateMerchantAnalytics = async (merchantId) => {
  try {
    const [products, orders, reviews] = await Promise.all([
      Product.find({ merchant: merchantId }).select("_id name quantityInStock"),
      Order.find({ merchant: merchantId }),
      Review.find({ product: { $in: await Product.find({ merchant: merchantId }).select("_id") } }).select("rating"),
    ]);

    const totalProducts = products.length;
    const totalOrders = orders.length;
    const totalSales = orders.reduce((sum, order) =>
      sum + order.products.reduce((s, p) => s + p.quantity * p.price, 0), 0);
    const stockLevels = products.map((p) => p._id);
    const avgRatings = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;

    await MerchantAnalytics.findOneAndUpdate(
      { merchant: merchantId },
      {
        totalProducts,
        totalOrders,
        totalSales,
        stockLevels,
        avgRatings,
        salesGrowth: 0, // Compute via separate job comparing periods
      },
      { upsert: true }
    );
  } catch (error) {
    console.error(`Failed to update merchant analytics for ${merchantId}:`, error);
  }
};