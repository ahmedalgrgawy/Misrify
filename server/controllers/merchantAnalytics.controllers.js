import Product from "../models/product.model.js";
import Review from "../models/review.model.js";
import Order from "../models/order.model.js";
import moment from "moment";
import MerchantAnalytics from "../models/merchantAnalytics.model.js";
import mongoose from "mongoose";
import Brand from "../models/brand.model.js";
import User from "../models/user.model.js";
import OrderItem from "../models/orderItem.model.js";

export const getStockLevel = async (req, res, next) => {

  const brand = await Brand.find({ owner: req.user._id });

  const products = await Product.find({ brand: brand[0]._id }).select("name quantityInStock");

  res.status(200).json({
    success: true,
    message: "Stock levels fetched successfully",
    products,
  });
};

export const getProductsWithAvgRatings = async (req, res, next) => {

  const brand = await Brand.find({ owner: req.user._id });

  const products = await Product.aggregate([
    {
      $match: {
        brand: new mongoose.Types.ObjectId(brand[0]._id),
      },
    },
    {
      $lookup: {
        from: "reviews",
        localField: "reviews",
        foreignField: "_id",
        as: "reviewArray",
      },
    },
    {
      $unwind: {
        path: "$reviewArray",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $group: {
        _id: "$_id",
        name: { $first: "$name" },
        totalReviews: { $sum: 1 },
        averageRating: { $avg: "$reviewArray.rating" },
      },
    },
    {
      $project: {
        name: 1,
        totalReviews: 1,
        averageRating: {
          $cond: {
            if: { $gt: ["$totalReviews", 0] },
            then: { $round: ["$averageRating", 2] }, // Round to 2 decimal places
            else: 0,
          },
        },
      },
    },
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
    const { period = "monthly" } = req.query; // weekly, monthly, annually
    const merchantId = req.user._id;
    const currentYear = moment().year();
    const startOfWeek = moment().startOf("week"); // Sunday

    // Find merchant's brand(s)
    const brands = await Brand.find({ owner: merchantId }).select("_id");
    if (!brands || brands.length === 0) {
      let timeSeries;
      if (period === "weekly") {
        timeSeries = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((label) => ({
          label,
          totalMoneyPaid: 0,
        }));
      } else if (period === "monthly") {
        timeSeries = Array(4)
          .fill()
          .map((_, i) => ({
            label: `Week ${i + 1}`,
            totalMoneyPaid: 0,
          }));
      } else if (period === "annually") {
        timeSeries = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(
          (label) => ({
            label,
            totalMoneyPaid: 0,
          })
        );
      }
      return res.status(200).json({
        success: true,
        message: "No brands found for this merchant",
        data: { totalSales: "0.00", growthRate: "0.00", timeSeries },
      });
    }
    const brandIds = brands.map((brand) => brand._id);

    let matchStage, groupBy, sortBy, projectLabel, fillPeriods, prevStart, prevEnd;

    switch (period) {
      case "weekly":
        matchStage = {
          "payment.status": "success",
          "productDetails.brand": { $in: brandIds },
          createdAt: {
            $gte: startOfWeek.toDate(),
            $lte: moment().endOf("week").toDate(),
          },
        };
        groupBy = { day: { $dayOfWeek: "$createdAt" } };
        sortBy = { "_id.day": 1 };
        projectLabel = {
          label: {
            $arrayElemAt: [
              ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
              { $subtract: ["$_id.day", 1] },
            ],
          },
        };
        fillPeriods = () =>
          ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((label) => ({
            label,
            totalMoneyPaid: 0,
          }));
        prevStart = moment().subtract(1, "week").startOf("week").toDate();
        prevEnd = moment().subtract(1, "week").endOf("week").toDate();
        break;
      case "monthly":
        matchStage = {
          "payment.status": "success",
          "productDetails.brand": { $in: brandIds },
          createdAt: {
            $gte: moment().startOf("month").toDate(),
            $lte: moment().endOf("month").toDate(),
          },
        };
        groupBy = {
          week: {
            $ceil: { $divide: [{ $dayOfMonth: "$createdAt" }, 7] },
          },
        };
        sortBy = { "_id.week": 1 };
        projectLabel = {
          label: {
            $concat: ["Week ", { $toString: "$_id.week" }],
          },
        };
        fillPeriods = () =>
          Array(4)
            .fill()
            .map((_, i) => ({
              label: `Week ${i + 1}`,
              totalMoneyPaid: 0,
            }));
        prevStart = moment().subtract(1, "month").startOf("month").toDate();
        prevEnd = moment().subtract(1, "month").endOf("month").toDate();
        break;
      case "annually":
        matchStage = {
          "payment.status": "success",
          "productDetails.brand": { $in: brandIds },
          createdAt: {
            $gte: moment().startOf("year").toDate(),
            $lte: moment().endOf("year").toDate(),
          },
        };
        groupBy = { month: { $month: "$createdAt" } };
        sortBy = { "_id.month": 1 };
        projectLabel = {
          label: {
            $arrayElemAt: [
              ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
              { $subtract: ["$_id.month", 1] },
            ],
          },
        };
        fillPeriods = () =>
          ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(
            (label) => ({
              label,
              totalMoneyPaid: 0,
            })
          );
        prevStart = moment().subtract(1, "year").startOf("year").toDate();
        prevEnd = moment().subtract(1, "year").endOf("year").toDate();
        break;
      default:
        throw new Error("Invalid period");
    }

    // Aggregation pipeline for current period
    const salesAggregation = await Order.aggregate([
      {
        $lookup: {
          from: "payments",
          localField: "_id",
          foreignField: "order",
          as: "payment",
        },
      },
      { $unwind: "$payment" },
      { $unwind: "$orderItems" },
      {
        $lookup: {
          from: "orderitems",
          localField: "orderItems",
          foreignField: "_id",
          as: "orderItemDetails",
        },
      },
      { $unwind: "$orderItemDetails" },
      {
        $lookup: {
          from: "products",
          localField: "orderItemDetails.product",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" },
      { $match: matchStage },
      {
        $group: {
          _id: groupBy,
          totalMoneyPaid: {
            $sum: {
              $multiply: ["$orderItemDetails.quantity", "$orderItemDetails.price"],
            },
          },
        },
      },
      { $sort: sortBy },
      {
        $project: {
          _id: 0,
          ...projectLabel,
          totalMoneyPaid: { $round: ["$totalMoneyPaid", 2] },
        },
      },
    ]);

    // Fill missing periods
    const filledSales = fillPeriods();
    salesAggregation.forEach((sale) => {
      const index =
        period === "weekly"
          ? ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(sale.label)
          : period === "monthly"
            ? parseInt(sale.label.replace("Week ", "")) - 1
            : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].indexOf(
              sale.label
            );
      if (index >= 0) {
        filledSales[index] = sale;
      }
    });

    // Calculate totalSales
    const totalSales = filledSales.reduce((sum, item) => sum + item.totalMoneyPaid, 0);

    // Previous period sales
    const prevSalesAggregation = await Order.aggregate([
      {
        $lookup: {
          from: "payments",
          localField: "_id",
          foreignField: "order",
          as: "payment",
        },
      },
      { $unwind: "$payment" },
      { $unwind: "$orderItems" },
      {
        $lookup: {
          from: "orderitems",
          localField: "orderItems",
          foreignField: "_id",
          as: "orderItemDetails",
        },
      },
      { $unwind: "$orderItemDetails" },
      {
        $lookup: {
          from: "products",
          localField: "orderItemDetails.product",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" },
      {
        $match: {
          "payment.status": "success",
          "productDetails.brand": { $in: brandIds },
          createdAt: { $gte: prevStart, $lte: prevEnd },
        },
      },
      {
        $group: {
          _id: null,
          totalMoneyPaid: {
            $sum: {
              $multiply: ["$orderItemDetails.quantity", "$orderItemDetails.price"],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalMoneyPaid: { $ifNull: ["$totalMoneyPaid", 0] },
        },
      },
    ]);

    const lastPeriodTotal = prevSalesAggregation.length > 0 ? prevSalesAggregation[0].totalMoneyPaid : 0;
    const growthRate = lastPeriodTotal > 0
      ? (((totalSales - lastPeriodTotal) / lastPeriodTotal) * 100).toFixed(2)
      : totalSales > 0 ? "100.00" : "0.00";

    res.status(200).json({
      success: true,
      message: "Sales growth data fetched successfully",
      data: {
        totalSales: totalSales.toFixed(2),
        growthRate,
        timeSeries: filledSales, // [{ label: "Week 1", totalMoneyPaid: 1000 }, ...]
      },
    });
  } catch (error) {
    console.error("Error in getSalesGrowth:", error.message);
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
    const year = moment().year();

    let salesRevenue = 0;

    const matchStage = {
      "payment.status": "success",
      createdAt: {
        $gte: moment().startOf("year").toDate(),
        $lte: moment().endOf("year").toDate(),
      },
    };

    if (role === "merchant") {
      matchStage.merchant = new mongoose.Types.ObjectId(userId);
    }

    const sales = await Order.aggregate([
      // Join with payments
      {
        $lookup: {
          from: "payments",
          localField: "_id",
          foreignField: "order",
          as: "payment",
        },
      },
      // Filter for paid orders
      { $match: matchStage },
      // Unwind payment
      { $unwind: "$payment" },
      // Group to sum paid amounts
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$payment.paymentDetails.amount" },
        },
      },
    ]);

    salesRevenue = sales.length > 0 ? sales[0].totalSales : 0;

    res.status(200).json({
      success: true,
      message: "Yearly income fetched successfully",
      data: {
        totalIncome: salesRevenue.toFixed(2),
      },
    });
  } catch (error) {
    console.error("Error in getYearlyIncome:", error.message);
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

    // Find the merchant's brand(s)
    const brands = await Brand.find({ owner: merchantId }).select("_id");
    if (!brands || brands.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No brands found for this merchant",
        data: Array(12).fill().map((_, i) => ({
          month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
          totalOrders: 0,
          totalRevenue: 0,
        })),
      });
    }
    const brandIds = brands.map((brand) => brand._id);

    const orderTrends = await Order.aggregate([
      // Match orders with successful payments
      {
        $lookup: {
          from: "payments",
          localField: "_id",
          foreignField: "order",
          as: "payment",
        },
      },
      {
        $match: {
          "payment.status": "success",
          createdAt: {
            $gte: new Date(year, 0, 1),
            $lte: new Date(year, 11, 31, 23, 59, 59),
          },
        },
      },
      // Unwind orderItems to process each OrderItem
      { $unwind: "$orderItems" },
      // Lookup OrderItem details
      {
        $lookup: {
          from: "orderitems",
          localField: "orderItems",
          foreignField: "_id",
          as: "orderItemDetails",
        },
      },
      { $unwind: "$orderItemDetails" },
      // Lookup Product details to check brand
      {
        $lookup: {
          from: "products",
          localField: "orderItemDetails.product",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" },
      // Filter for merchant's brand
      {
        $match: {
          "productDetails.brand": { $in: brandIds },
        },
      },
      // Group by month
      {
        $group: {
          _id: { month: { $month: "$createdAt" } },
          totalOrders: { $addToSet: "$_id" }, // Count unique orders
          totalRevenue: {
            $sum: {
              $multiply: ["$orderItemDetails.quantity", "$orderItemDetails.price"],
            },
          },
        },
      },
      // Sort by month
      { $sort: { "_id.month": 1 } },
      // Project final fields
      {
        $project: {
          _id: 0,
          month: {
            $arrayElemAt: [
              ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
              { $subtract: ["$_id.month", 1] },
            ],
          },
          totalOrders: { $size: "$totalOrders" }, // Count unique orders
          totalRevenue: { $round: ["$totalRevenue", 2] },
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
      data: filledTrends,
    });
  } catch (error) {
    console.error("Error in getMerchantOrderTrends:", error.message);
    next(error);
  }
};

export const getMerchantOrders = async (req, res, next) => {
  try {
    const merchantId = req.user._id;

    const orders = await Order.aggregate([
      {
        $lookup: {
          from: "brands",
          let: { merchantId: merchantId },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$owner", "$$merchantId"] },
              },
            },
            { $project: { _id: 1 } },
          ],
          as: "merchantBrands",
        },
      },
      {
        $lookup: {
          from: "products",
          let: { brandIds: "$merchantBrands._id" },
          pipeline: [
            {
              $match: {
                $expr: { $in: ["$brand", "$$brandIds"] },
              },
            },
            { $project: { _id: 1, name: 1, price: 1, imgUrl: 1 } },
          ],
          as: "merchantProducts",
        },
      },
      { $unwind: "$orderItems" },
      {
        $lookup: {
          from: "orderitems",
          let: { orderItemId: "$orderItems", productIds: "$merchantProducts._id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$_id", "$$orderItemId"] },
                    { $in: ["$product", "$$productIds"] },
                  ],
                },
              },
            },
            {
              $lookup: {
                from: "products",
                localField: "product",
                foreignField: "_id",
                as: "product",
              },
            },
            { $unwind: "$product" },
            {
              $project: {
                _id: 1,
                quantity: 1,
                price: 1,
                product: {
                  _id: "$product._id",
                  name: "$product.name",
                  price: "$product.price",
                  imgUrl: "$product.imgUrl",
                },
              },
            },
          ],
          as: "orderItemDetails",
        },
      },
      {
        $match: {
          "orderItemDetails.0": { $exists: true },
        },
      },
      {
        $group: {
          _id: "$_id",
          trackCode: { $first: "$trackCode" },
          status: { $first: "$status" },
          createdAt: { $first: "$createdAt" },
          orderItems: { $push: "$orderItemDetails" },
        },
      },
      { $unwind: "$orderItems" },
      { $unwind: "$orderItems" }, // Double unwind to access nested array
      {
        $group: {
          _id: "$_id",
          trackCode: { $first: "$trackCode" },
          status: { $first: "$status" },
          createdAt: { $first: "$createdAt" },
          orderItems: { $push: "$orderItems" },
          totalPrice: {
            $sum: { $multiply: ["$orderItems.quantity", "$orderItems.price"] },
          },
        },
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          trackCode: 1,
          status: 1,
          createdAt: 1,
          totalPrice: 1,
          orderItems: 1,
          user: { name: "$user.name", email: "$user.email" },
        },
      },
    ]);

    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

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