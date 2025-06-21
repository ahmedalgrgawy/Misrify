import AppError from "../errors/AppError.js";
import Brand from "../models/brand.model.js";
import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";

export const getBrands = async (req, res, next) => {
    const Brands = await Brand.find()
        .populate("owner", ["name", "email", "phoneNumber", "address"])
        .exec();

    if (!Brands || Brands.length === 0) {
        return next(new AppError("No Brands Found", 404))
    }

    res.status(200).json({ success: true, Brands })
}

export const createBrand = async (req, res, next) => {
    const { ownerId, name, description, imgUrl } = req.body;
    const normalizedName = name.toLowerCase();

    const isBrandExist = await Brand.findOne({ name: normalizedName });

    if (isBrandExist) {
        return next(new AppError("Brand already exists", 400));
    }

    const doesOwnerAlreadyHaveBrand = await Brand.findOne({ owner: ownerId });

    if (doesOwnerAlreadyHaveBrand) {
        return next(new AppError("Owner already has a brand", 400));
    }

    const brand = new Brand({ name: normalizedName, description, owner: ownerId, imgUrl });

    await brand.save();

    await Notification.create({
        receivers: [ownerId],
        sender: "Misrify Store",
        content: `Brand ${name} has been created`,
        type: "brand",
        isRead: false,
    });

    res.status(201).json({ success: true, message: "Brand created successfully" });
};

export const editBrand = async (req, res, next) => {
    const brandId = req.params.id;
    const { name, description, imgUrl } = req.body;

    if (!brandId) {
        return next(new AppError("Brand ID is required", 400));
    }

    const brand = await Brand.findById(brandId);

    if (!brand) {
        return next(new AppError("Brand not found", 404));
    }

    const owner = await User.findById(brand.owner);

    brand.name = name ? name.toLowerCase() : brand.name;
    brand.description = description || brand.description;
    brand.imgUrl = imgUrl || brand.imgUrl;

    await brand.save();

    await Notification.create({
        receivers: [owner._id],
        sender: "Misrify Store",
        content: `Brand ${brand.name} has been updated`,
        type: "brand",
        isRead: false,
    });

    res.status(200).json({ success: true, message: "Brand updated successfully", brand });
};

export const deleteBrand = async (req, res, next) => {
    const brandId = req.params.id;

    if (!brandId) {
        return next(new AppError("Brand ID is required", 400));
    }

    const brand = await Brand.findById(brandId);

    if (!brand) {
        return next(new AppError("Brand not found", 404));
    }

    const owner = await User.findById(brand.owner);

    await brand.deleteOne();

    await Notification.create({
        receivers: [owner._id],
        sender: "Misrify Store",
        content: `Brand ${brand.name} has been deleted`,
        type: "brand",
        isRead: false,
    });

    res.status(200).json({ success: true, message: "Brand deleted successfully" });
};