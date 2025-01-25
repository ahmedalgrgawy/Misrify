import cloudinary from "../lib/cloudinary.js";
import Brand from "../models/brand.model.js";
import Product from "../models/product.model.js";

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

    const user = req.user;

    const uploadedResponse = await cloudinary.uploader.upload(imgUrl, {
        folder: "Products"
    });

    imgUrl = uploadedResponse.secure_url;

    if (user.role === 'merchant') {
        const merchantBrand = await Brand.findOne({ owner: user._id });

        if (!merchantBrand) {
            return res.status(404).json({ success: false, message: "Merchant Does Not Have A Brand " })
        }

        brandId = merchantBrand._id;
    }

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
        isApproved: user.role === 'merchant' ? false : true
    }).populate("category").populate("brand");

    await product.save();

    res.status(201).json({ success: true, message: "Product Created Successfully", product })
}

export const editProduct = async (req, res) => {
    const { id } = req.params;
    const { name, categoryId, brandId, description, quantityInStock, price, colors, sizes, isDiscounted, discountAmount } = req.body
    let { imgUrl } = req.body;

    const user = req.user

    const product = await Product.findById(id).populate("category").populate("brand");

    if (!product) {
        return res.status(404).json({ success: false, message: "Product Not Found" })
    }

    if (user.role === 'merchant') {
        if (product.brand.owner.toString() !== user._id.toString()) {
            return res.status(401).json({ success: false, message: "You Are Not Authorized To Edit This Product" })
        } else {
            brandId = product.brand._id;
        }
    }

    if (imgUrl) {
        await cloudinary.uploader.destroy(product.imgUrl.split("/").pop().split(".")[0]);
        const uploadedResponse = await cloudinary.uploader.upload(imgUrl, {
            folder: "Products"
        });
        imgUrl = uploadedResponse.secure_url;
    }

    product.name = name || product.name;
    product.category = categoryId || product.category.id;
    product.brand = brandId || product.brand._id;
    product.description = description || product.description;
    product.quantityInStock = quantityInStock || product.quantityInStock;
    product.price = price || product.price;
    product.colors = colors || product.colors;
    product.sizes = sizes || product.sizes;
    product.imgUrl = imgUrl || product.imgUrl;
    product.isDiscounted = isDiscounted || product.isDiscounted;
    product.discountAmount = discountAmount || product.discountAmount;

    await product.save();

    res.status(200).json({ success: true, message: "Product Updated Successfully", product })
}

export const deleteProduct = async (req, res) => {
    const { id } = req.params;
    const user = req.user;

    if (!id) {
        return res.status(400).json({ success: false, message: "Product Id is Required" })
    }

    const product = await Product.findById(id).populate("category").populate("brand");

    if (!product) {
        return res.status(404).json({ success: false, message: "Product Not Found" })
    }

    if (user.role === 'merchant') {
        if (product.brand.owner.toString() !== user._id.toString()) {
            return res.status(401).json({ success: false, message: "You Are Not Authorized To Delete This Product" })
        }
    }

    await product.deleteOne();

    res.status(200).json({ success: true, message: "Product Deleted Successfully" })
}

// <<<<<<<<<<<<<<<<< Merchant Functions >>>>>>>>>>>>>>>>>>>>>>>>>>
export const getMerchantProducts = async (req, res) => {
    const merchantId = req.user._id;
    const merchantBrand = await Brand.findOne({ owner: merchantId });

    if (!merchantBrand) {
        return res.status(404).json({ success: false, message: "Merchant Does Not Have A Brand " })
    }

    const products = await Product.find({ brand: merchantBrand._id }).populate("category")
        .populate("brand")
        .exec();

    if (!products || products.length === 0) {
        return res.status(404).json({ success: false, message: "No Products Found" })
    }

    res.status(200).json({ success: true, merchantProducts: products })

}


// <<<<<<<<<<<<<<<<< User Functions >>>>>>>>>>>>>>>>>>>>>>>>>>


