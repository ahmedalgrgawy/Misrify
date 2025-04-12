import Category from "../models/category.model.js";
import Brand from "../models/brand.model.js";
import Product from "../models/product.model.js";
import Order from "../models/order.model.js";
import User from "../models/user.model.js";
import LoginAttempt from "../models/loginAttempt.model.js";

export const getPlatformStats = async (req, res, next) => {
    const totalCategories = await Category.countDocuments();
    const totalBrands = await Brand.countDocuments();
    const totalProducts = await Product.countDocuments();

    res.status(200).json({
        success: true,
        message: "Platform stats fetched successfully",
        stats: {
            totalCategories,
            totalBrands,
            totalProducts,
        }
    });
};

export const getOrdersAndSales = async (req, res, next) => {
    const orders = await Order.find().select("totalPrice");

    const totalOrders = orders.length;
    const totalMoneyPaid = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);

    res.status(200).json({
        success: true,
        message: "Orders and total sales analytics fetched successfully",
        data: {
            totalOrders,
            totalMoneyPaid,
        }
    });
};

export const getTotalUsers = async (req, res, next) => {
    const totalUsers = await User.countDocuments();

    res.status(200).json({
        success: true,
        message: "Total users fetched successfully",
        data: {
            totalUsers,
        }
    });
};

export const getLoginStats = async (req, res, next) => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const loginStats = await LoginAttempt.aggregate([
        {
            $match: {
                createdAt: { $gte: oneWeekAgo }
            }
        },
        {
            $group: {
                _id: {
                    year: { $year: "$createdAt" },
                    month: { $month: "$createdAt" },
                    day: { $dayOfMonth: "$createdAt" }
                },
                count: { $sum: 1 }
            }
        },
        {
            $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 }
        }
    ]);

    res.status(200).json({
        success: true,
        message: "Login stats for past 7 days fetched successfully",
        loginStats
    });
};