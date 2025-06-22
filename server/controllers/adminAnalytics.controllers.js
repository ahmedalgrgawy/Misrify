import Category from "../models/category.model.js";
import Brand from "../models/brand.model.js";
import Product from "../models/product.model.js";
import Order from "../models/order.model.js";
import User from "../models/user.model.js";
import LoginAttempt from "../models/loginAttempt.model.js";
import moment from "moment";
import AdminAnalytics from "../models/adminAnalytics.model.js";

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

    const { period = "monthly" } = req.query;
    const currentYear = moment().year();
    const currentMonth = moment().month();
    const startOfWeek = moment().startOf("week");

    let matchStage, groupBy, sortBy, projectLabel, fillPeriods;

    switch (period) {
        case "weekly":
            matchStage = {
                "payment.status": "success",
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
                    totalOrders: 0,
                    totalMoneyPaid: 0,
                }));
            break;
        case "monthly":
            // 4 weeks of the current month
            matchStage = {
                "payment.status": "success",
                createdAt: {
                    $gte: moment().startOf("month").toDate(),
                    $lte: moment().endOf("month").toDate(),
                },
            };
            groupBy = {
                week: {
                    $subtract: [
                        { $week: "$createdAt" },
                        { $week: moment().startOf("month").toDate() },
                    ],
                },
            };
            sortBy = { "_id.week": 1 };
            projectLabel = {
                label: {
                    $concat: ["Week ", { $toString: { $add: ["$_id.week", 1] } }],
                },
            };
            fillPeriods = () =>
                Array(4)
                    .fill()
                    .map((_, i) => ({
                        label: `Week ${i + 1}`,
                        totalOrders: 0,
                        totalMoneyPaid: 0,
                    }));
            break;
        case "annually":
            matchStage = {
                "payment.status": "success",
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
                        totalOrders: 0,
                        totalMoneyPaid: 0,
                    })
                );
            break;
        default:
            throw new Error("Invalid period");
    }

    const orders = await Order.aggregate([
        { $lookup: { from: "payments", localField: "_id", foreignField: "order", as: "payment" } },
        { $match: matchStage },
        { $unwind: "$payment" },
        {
            $group: {
                _id: groupBy,
                totalOrders: { $sum: 1 },
                totalMoneyPaid: { $sum: "$payment.paymentDetails.amount" },
            },
        },
        { $sort: sortBy },
        {
            $project: {
                _id: 0,
                ...projectLabel,
                totalOrders: 1,
                totalMoneyPaid: { $round: ["$totalMoneyPaid", 2] },
            },
        },
    ]);

    // Fill missing periods
    const filledOrders = fillPeriods();
    orders.forEach((order) => {
        const index =
            period === "weekly"
                ? ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(order.label)
                : period === "monthly"
                    ? parseInt(order.label.replace("Week ", "")) - 1
                    : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].indexOf(
                        order.label
                    );
        if (index >= 0) {
            filledOrders[index] = order;
        }
    });

    const totalOrders = filledOrders.reduce((sum, item) => sum + item.totalOrders, 0);
    const totalMoneyPaid = filledOrders.reduce((sum, item) => sum + item.totalMoneyPaid, 0);

    res.status(200).json({
        success: true,
        message: "Orders and total sales analytics fetched successfully",
        data: {
            totalOrders,
            totalMoneyPaid,
            timeSeries: filledOrders,
        },
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

export const getMiniChartData = async (req, res, next) => {

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

};


export const updateAdminAnalytics = async () => {
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
};