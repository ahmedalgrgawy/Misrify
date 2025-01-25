import cloudinary from "../lib/cloudinary";
import Product from "../models/product.model";

// <<<<<<<<<<<<<<<<< Admin Functions >>>>>>>>>>>>>>>>>>>>>>>>>>
export const getRequestedProducts = async (req, res) => {
    const RequestedProducts = await Product.find({ isApproved: false })
        .populate("category")
        .populate("brand")
        .populate("merchant")
        .exec();

    if (!RequestedProducts || RequestedProducts.length === 0) {
        return res.status(404).json({ success: false, message: "No Requested Products Found" })
    }

    res.status(200).json({ success: true, RequestedProducts })
}

export const getProducts = async (req, res) => {
    const Products = await Product.find({ isApproved: true })
        .populate("category")
        .populate("brand")
        .populate("merchant")
        .exec();

    if (!Products || Products.length === 0) {
        return res.status(404).json({ success: false, message: "No Products Found" })
    }

    res.status(200).json({ success: true, Products })
}

export const approveOrRejectProduct = async (req, res) => {
    const { id } = req.params;
    const { isApproved } = req.body;

    if (!isApproved) {
        return res.status(400).json({ success: false, message: "isApproved is Required" })
    }

    if (!id) {
        return res.status(400).json({ success: false, message: "Product Id is Required" })
    }

    const ProductToApprove = await Product.findById(id);

    if (!ProductToApprove) {
        return res.status(404).json({ success: false, message: "Product Not Found" })
    }

    if (isApproved === false) {
        await ProductToApprove.remove();
        return res.status(200).json({ success: true, message: "Product Rejected" })
    }

    ProductToApprove.isApproved = true;

    await ProductToApprove.save();

    res.status(200).json({ success: true, message: "Product Approved" })
}

export const createProduct = async (req, res) => {
    const { name, categoryId, brandId, description, quantityInStock, price, colors, sizes, isDiscounted, discountAmount } = req.body
    let { imgUrl } = req.body;

    const uploadedResponse = await cloudinary.uploader.upload(imgUrl, {
        folder: "Products"
    });

    imgUrl = uploadedResponse.secure_url;

    const product = new Product({
        name,
        category: categoryId,
        brand: brandId,
        description,
        quantityInStock,
        price,
        colors,
        sizes,
        imgUrl,
        isDiscounted,
        discountAmount,
        isApproved: true
    })

    await product.save();

    res.status(201).json({ success: true, message: "Product Created Successfully", product })
}

export const editProduct = async (req, res) => {

}

// <<<<<<<<<<<<<<<<< Merchant Functions >>>>>>>>>>>>>>>>>>>>>>>>>>

// <<<<<<<<<<<<<<<<< User Functions >>>>>>>>>>>>>>>>>>>>>>>>>>


