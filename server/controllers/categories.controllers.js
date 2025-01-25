import Category from "../models/category.model.js";

export const getAllCategories = async (req, res) => {
    const Categories = await Category.find().exec();

    if (!Categories || Categories.length === 0) {
        return res.status(404).json({ success: false, message: "No Categories Found" })
    }

    res.status(200).json({ success: true, Categories })
}

export const createCategory = async (req, res) => {
    const { name, description } = req.body;

    const category = new Category({ name, description });

    await category.save();

    res.status(201).json({ success: true, message: "Category Created Successfully" })
}

export const editCategory = async (req, res) => {
    const categoryId = req.params.id;
    const { name, description } = req.body;

    if (!categoryId) {
        return res.status(400).json({ success: false, message: "Category ID is required" })
    }

    const category = await Category.findById(categoryId);

    if (!category) {
        return res.status(404).json({ success: false, message: "Category not found" })
    }

    category.name = name || category.name;
    category.description = description || category.description;;

    await category.save();

    res.status(200).json({ success: true, message: "Category updated successfully", category })
}

export const deleteCategory = async (req, res) => {
    const categoryId = req.params.id;

    if (!categoryId) {
        return res.status(400).json({ success: false, message: "Category ID is required" })
    }

    const category = await Category.findById(categoryId);

    if (!category) {
        return res.status(404).json({ success: false, message: "Category not found" })
    }

    await category.deleteOne();

    res.status(200).json({ success: true, message: "Category deleted successfully" })
}