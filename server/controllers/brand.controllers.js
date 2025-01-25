import Brand from "../models/brand.model";

export const getBrands = async (req, res) => {
    const Brands = await Brand.find().populate("owner").exec();

    if (!Brands || Brands.length === 0) {
        return res.status(404).json({ success: false, message: "No Brands Found" })
    }

    res.status(200).json({ success: true, Brands })
}