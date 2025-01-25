import AppError from "../errors/AppError.js";
import Category from "../models/category.model.js";

export const getAllCategories = async (req, res, next) => {
    const Categories = await Category.find().exec();

    if (!Categories || Categories.length === 0) {
        return next(new AppError("No Categories Found", 404))
    }

    res.status(200).json({ success: true, Categories })
}

export const createCategory = async (req, res, next) => {
    const { name, description } = req.body;

    const category = new Category({ name, description });

    await category.save();

    res.status(201).json({ success: true, message: "Category Created Successfully" })
}

export const editCategory = async (req, res, next) => {
    const categoryId = req.params.id;
    const { name, description } = req.body;

    if (!categoryId) {
        return next(new AppError("Category ID is required", 400))
    }

    const category = await Category.findById(categoryId);

    if (!category) {
        return next(new AppError("Category not found", 404))
    }

    category.name = name || category.name;
    category.description = description || category.description;;

    await category.save();

    res.status(200).json({ success: true, message: "Category updated successfully", category })
}

export const deleteCategory = async (req, res, next) => {
    const categoryId = req.params.id;

    if (!categoryId) {
        return next(new AppError("Category ID is required", 400))
    }

    const category = await Category.findById(categoryId);

    if (!category) {
        return next(new AppError("Category not found", 404))
    }

    await category.deleteOne();

    res.status(200).json({ success: true, message: "Category deleted successfully" })
}