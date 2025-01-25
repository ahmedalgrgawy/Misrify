import AppError from "../errors/AppError.js";
import Brand from "../models/brand.model.js";

export const getBrands = async (req, res, next) => {
    const Brands = await Brand.find().populate("owner").exec();

    if (!Brands || Brands.length === 0) {
        return next(new AppError("No Brands Found", 404))
    }

    res.status(200).json({ success: true, Brands })
}

export const createBrand = async (req, res, next) => {

    const { ownerId, name, description } = req.body;
    name.toLowerCase();

    const isBrandExist = await Brand.findOne({ name });

    if (isBrandExist) {
        return next(new AppError("Brand already exists", 400))
    }

    const brand = new Brand({ name, description, owner: ownerId });

    await brand.save();

    res.status(201).json({ success: true, message: "Brand Created Successfully" })
}

export const editBrand = async (req, res, next) => {
    const brandId = req.params.id;
    const { name, description } = req.body;

    if (!brandId) {
        return next(new AppError("Brand ID is required", 400))
    }

    const brand = await Brand.findById(brandId);

    if (!brand) {
        return next(new AppError("Brand not found", 404))
    }

    brand.name = name || brand.name;
    brand.description = description || brand.description;

    await brand.save();

    res.status(200).json({ success: true, message: "Brand updated successfully", brand })
}

export const deleteBrand = async (req, res, next) => {
    const brandId = req.params.id;

    if (!brandId) {
        return next(new AppError("Brand ID is required", 400))
    }

    const brand = await Brand.findById(brandId);

    if (!brand) {
        return next(new AppError("Brand not found", 404))
    }

    await brand.deleteOne();

    res.status(200).json({ success: true, message: "Brand deleted successfully" })
}