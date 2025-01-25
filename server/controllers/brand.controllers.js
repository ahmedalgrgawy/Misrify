import Brand from "../models/brand.model.js";

export const getBrands = async (req, res) => {
    const Brands = await Brand.find().populate("owner").exec();

    if (!Brands || Brands.length === 0) {
        return res.status(404).json({ success: false, message: "No Brands Found" })
    }

    res.status(200).json({ success: true, Brands })
}

export const createBrand = async (req, res) => {

    const adminOrMerchantId = req.user._id;
    const { name, description } = req.body;
    name.toLowerCase();

    const isBrandExist = await Brand.findOne({ name });

    if (isBrandExist) {
        return res.status(400).json({ success: false, message: "Brand already exists" })
    }

    const brand = new Brand({ name, description, owner: adminOrMerchantId });

    await brand.save();

    res.status(201).json({ success: true, message: "Brand Created Successfully" })
}

export const editBrand = async (req, res) => {
    const brandId = req.params.id;
    const { name, description } = req.body;

    if (!brandId) {
        return res.status(400).json({ success: false, message: "Brand ID is required" })
    }

    const brand = await Brand.findById(brandId);

    if (!brand) {
        return res.status(404).json({ success: false, message: "Brand not found" })
    }

    brand.name = name || brand.name;
    brand.description = description || brand.description;

    await brand.save();

    res.status(200).json({ success: true, message: "Brand updated successfully", brand })
}

export const deleteBrand = async (req, res) => {
    const brandId = req.params.id;

    if (!brandId) {
        return res.status(400).json({ success: false, message: "Brand ID is required" })
    }

    const brand = await Brand.findById(brandId);

    if (!brand) {
        return res.status(404).json({ success: false, message: "Brand not found" })
    }

    await brand.deleteOne();

    res.status(200).json({ success: true, message: "Brand deleted successfully" })
}