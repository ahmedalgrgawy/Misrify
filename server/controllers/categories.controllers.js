import AppError from "../errors/AppError.js";
import Category from "../models/category.model.js";
import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";

export const getAllCategories = async (req, res, next) => {
    const categories = await Category.find().exec();

    if (!categories || categories.length === 0) {
        return next(new AppError("No Categories Found", 404));
    }

    res.status(200).json({ success: true, categories });
};

export const createCategory = async (req, res, next) => {
    const { name, description, imgUrl } = req.body;

    const category = new Category({ name, description, imgUrl });

    await category.save();

    const adminsAndMerchants = await User.find({
        role: { $in: ["admin", "merchant"] },
        _id: { $ne: req.user._id },
    });

    await Notification.create({
        receivers: adminsAndMerchants.map(user => user._id),
        sender: "Misrify Store",
        content: `Category ${name} has been created`,
        type: "category",
        isRead: false,
    });

    res.status(201).json({ success: true, message: "Category created successfully" });
};

export const editCategory = async (req, res, next) => {
    const categoryId = req.params.id;
    const { name, description, imgUrl } = req.body;

    if (!categoryId) {
        return next(new AppError("Category ID is required", 400));
    }

    const category = await Category.findById(categoryId);

    if (!category) {
        return next(new AppError("Category not found", 404));
    }

    category.name = name || category.name;
    category.description = description || category.description;
    category.imgUrl = imgUrl || category.imgUrl;

    await category.save();

    const adminsAndMerchants = await User.find({
        role: { $in: ["admin", "merchant"] },
        _id: { $ne: req.user._id },
    });

    await Notification.create({
        receivers: adminsAndMerchants.map(user => user._id),
        sender: "Misrify Store",
        content: `Category ${category.name} has been updated`,
        type: "category",
        isRead: false,
    });

    res.status(200).json({ success: true, message: "Category updated successfully", category });
};

export const deleteCategory = async (req, res, next) => {
    const categoryId = req.params.id;

    if (!categoryId) {
        return next(new AppError("Category ID is required", 400));
    }

    const category = await Category.findById(categoryId);

    if (!category) {
        return next(new AppError("Category not found", 404));
    }

    await category.deleteOne();

    const adminsAndMerchants = await User.find({
        role: { $in: ["admin", "merchant"] },
        _id: { $ne: req.user._id },
    });

    await Notification.create({
        receivers: adminsAndMerchants.map(user => user._id),
        sender: "Misrify Store",
        content: `Category ${category.name} has been deleted`,
        type: "category",
        isRead: false,
    });

    res.status(200).json({ success: true, message: "Category deleted successfully" });
};