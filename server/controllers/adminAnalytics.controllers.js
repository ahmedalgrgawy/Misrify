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
    try {
        const { period = "monthly" } = req.query; // weekly, monthly, annually

        let groupBy;
        switch (period) {
            case "weekly":
                groupBy = {
                    year: { $year: "$createdAt" },
                    week: { $week: "$createdAt" },
                    day: { $dayOfWeek: "$createdAt" },
                };
                break;
            case "annually":
                groupBy = { year: { $year: "$createdAt" } };
                break;
            default: // monthly
                groupBy = {
                    year: { $year: "$createdAt" },
                    month: { $month: "$createdAt" },
                };
        }

        const orders = await Order.aggregate([
            {
                $group: {
                    _id: groupBy,
                    totalOrders: { $sum: 1 },
                    totalMoneyPaid: { $sum: "$totalPrice" },
                },
            },
            {
                $sort: period === "weekly" ? { "_id.year": 1, "_id.week": 1, "_id.day": 1 } : { "_id.year": 1, "_id.month": 1 },
            },
            {
                $project: {
                    _id: 0,
                    label: period === "weekly" ? {
                        $arrayElemAt: [["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], { $subtract: ["$_id.day", 1] }],
                    } : period === "annually" ? "$_id.year" : {
                        $arrayElemAt: [
                            ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                            { $subtract: ["$_id.month", 1] },
                        ],
                    },
                    totalOrders: 1,
                    totalMoneyPaid: 1,
                },
            },
        ]);

        const totalOrders = orders.reduce((sum, item) => sum + item.totalOrders, 0);
        const totalMoneyPaid = orders.reduce((sum, item) => sum + item.totalMoneyPaid, 0);

        res.status(200).json({
            success: true,
            message: "Orders and total sales analytics fetched successfully",
            data: {
                totalOrders,
                totalMoneyPaid,
                timeSeries: orders, // [{ label: "Jan", totalOrders: 50, totalMoneyPaid: 5000 }, ...]
            },
        });
    } catch (error) {
        next(error);
    }
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

export const getMiniChartData = async (req, res, next) => {
    try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const [orders, brands, products, users, categories] = await Promise.all([
            Order.aggregate([
                { $match: { createdAt: { $gte: sevenDaysAgo } } },
                {
                    $group: {
                        _id: { $dayOfWeek: "$createdAt" },
                        count: { $sum: 1 },
                    },
                },
                { $sort: { "_id": 1 } },
            ]),
            Brand.aggregate([
                { $match: { createdAt: { $gte: sevenDaysAgo } } },
                {
                    $group: {
                        _id: { $dayOfWeek: "$createdAt" },
                        count: { $sum: 1 },
                    },
                },
                { $sort: { "_id": 1 } },
            ]),
            Product.aggregate([
                { $match: { createdAt: { $gte: sevenDaysAgo } } },
                {
                    $group: {
                        _id: { $dayOfWeek: "$createdAt" },
                        count: { $sum: 1 },
                    },
                },
                { $sort: { "_id": 1 } },
            ]),
            User.aggregate([
                { $match: { createdAt: { $gte: sevenDaysAgo } } },
                {
                    $group: {
                        _id: { $dayOfWeek: "$createdAt" },
                        count: { $sum: 1 },
                    },
                },
                { $sort: { "_id": 1 } },
            ]),
            Category.aggregate([
                { $match: { createdAt: { $gte: sevenDaysAgo } } },
                {
                    $group: {
                        _id: { $dayOfWeek: "$createdAt" },
                        count: { $sum: 1 },
                    },
                },
                { $sort: { "_id": 1 } },
            ]),
        ]);

        const fillDays = (data) =>
            Array(7)
                .fill(0)
                .map((_, i) => {
                    const found = data.find((item) => item._id === i + 1);
                    return found ? found.count : 0;
                });

        res.status(200).json({
            success: true,
            message: "Mini chart data fetched successfully",
            data: {
                orders: fillDays(orders),
                brands: fillDays(brands),
                products: fillDays(products),
                users: fillDays(users),
                categories: fillDays(categories),
                labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            },
        });
    } catch (error) {
        next(error);
    }
};

import AdminAnalytics from "../models/adminAnalytics.model.js";

export const updateAdminAnalytics = async () => {
    try {
        const [totalCategories, totalBrands, totalProducts, totalUsers, orders] = await Promise.all([
            Category.countDocuments(),
            Brand.countDocuments(),
            Product.countDocuments(),
            User.countDocuments(),
            Order.find().select("totalPrice"),
        ]);

        const totalOrders = orders.length;
        const totalSales = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);

        await AdminAnalytics.findOneAndUpdate(
            { user: null }, // Admin analytics may not be tied to a specific user
            {
                totalCategories,
                totalBrands,
                totalProducts,
                totalUsers,
                totalOrders,
                totalSales,
            },
            { upsert: true }
        );
    } catch (error) {
        console.error("Failed to update admin analytics:", error);
    }
};