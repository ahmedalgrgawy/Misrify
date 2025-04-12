import Category from "../models/category.model.js";
import Brand from "../models/brand.model.js";
import Product from "../models/product.model.js";
import Order from "../models/order.model.js";
import User from "../models/user.model.js";

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