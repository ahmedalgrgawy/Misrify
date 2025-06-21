import AppError from "../errors/AppError.js";
import cloudinary from "../lib/cloudinary.js";
import Brand from "../models/brand.model.js";
import Product from "../models/product.model.js";
import Category from "../models/category.model.js";
import Review from "../models/review.model.js";
import { isValidObjectId } from "../validators/validateCollegeEmail.js";
import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";

// <<<<<<<<<<<<<<<<< Admin Functions >>>>>>>>>>>>>>>>>>>>>>>>>>
export const getRequestedProducts = async (req, res, next) => {

    const user = req.user;

    let requestedProducts = [];

    if (user.role === 'merchant') {

        const brand = await Brand.findOne({ owner: user._id });

        if (!brand) {
            return next(new AppError("You Are Not Authorized To View This Page", 401));
        }

        requestedProducts = await Product.find({ isApproved: false, brand: brand._id })
            .populate("category")
            .populate("brand")
            .exec();
    } else {
        requestedProducts = await Product.find({ isApproved: false })
            .populate("category")
            .populate("brand")
            .exec();
    }



    if (!requestedProducts || requestedProducts.length === 0) {
        return next(new AppError("No Requested Products Found", 404))
    }

    res.status(200).json({ success: true, requestedProducts })
}

export const getProducts = async (req, res, next) => {
    const Products = await Product.find({ isApproved: true })
        .populate("category")
        .populate("brand")
        .exec();

    if (!Products || Products.length === 0) {
        return next(new AppError("No Products Found", 404))
    }

    res.status(200).json({ success: true, Products })
}

export const approveOrRejectProduct = async (req, res, next) => {
    const { id } = req.params;
    const { isApproved } = req.body;

    if (!isApproved) {
        return next(new AppError("isApproved is Required", 400))
    }

    if (!id) {
        return next(new AppError("Product Id is Required", 400))
    }

    const ProductToApprove = await Product.findById(id).populate("category").populate("brand");

    if (!ProductToApprove) {
        return next(new AppError("Product Not Found", 404))
    }

    if (ProductToApprove.isApproved) {
        return next(new AppError("Product Already Approved", 400))
    }

    if (isApproved.toLowerCase() === "no") {
        await ProductToApprove.deleteOne();
        return next(new AppError("Product Rejected", 200))
    }

    ProductToApprove.isApproved = true;

    await ProductToApprove.save();

    if (ProductToApprove.brand !== null) {
        // const merchant = await User.findById(ProductToApprove.brand.owner);

        if (ProductToApprove.isApproved) {
            await Notification.create({
                receivers: [ProductToApprove.brand.owner._id], // Changed to receivers array
                sender: "Misrify Store", // Updated to Misrify Store
                content: `Product ${ProductToApprove.name} has been approved`, // Changed to content
                type: "product",
                isRead: false,
            });
        } else {
            await Notification.create({
                receivers: [ProductToApprove.brand.owner._id], // Changed to receivers array
                sender: "Misrify Store", // Updated to Misrify Store
                content: `Product ${ProductToApprove.name} has been rejected`, // Changed to content
                type: "product",
                isRead: false,
            });
        }
    }

    res.status(200).json({ success: true, message: "Product Approved" })
}

export const createProduct = async (req, res, next) => {
    const { name, categoryId, description, quantityInStock, price, colors, imgUrl, sizes, isDiscounted, discountAmount } = req.body
    let { brandId } = req.body;

    const user = req.user;

    if (user.role === 'merchant') {
        const merchantBrand = await Brand.findOne({ owner: user._id });

        if (!merchantBrand) {
            return next(new AppError("Merchant Does Not Have A Brand", 404))
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
    })

    await product.save();

    const admins = await User.find({ role: "admin" }).select("_id");
    const brandMerchant = await Brand.findById(brandId).populate("owner");

    if (user.role === 'merchant') {

        await Notification.create({
            receivers: admins.map(admin => admin._id), // Changed to receivers array
            sender: user.id, // Updated to Misrify Store
            content: `Product ${name} has been requested for approval by ${user.name}`, // Changed to content
            type: "product",
            isRead: false,
        })

    } else {
        await Notification.create({
            receivers: [brandMerchant.owner._id], // Changed to receivers array
            sender: "Misrify Store", // Updated to Misrify Store
            content: `Product ${name} has been created by Misrify Store for your brand named ${brandMerchant.name}`, // Changed to content
            type: "product",
            isRead: false,
        })
    }

    res.status(201).json({ success: true, message: "Product Created Successfully", product })
}

export const editProduct = async (req, res, next) => {
    const { id } = req.params;
    const { name, categoryId, description, quantityInStock, price, colors, sizes, isDiscounted, discountAmount } = req.body
    let { imgUrl, brandId } = req.body;

    const user = req.user

    // if (!isValidObjectId(id)) return next(new AppError("Invalid product ID", 400))

    const product = await Product.findById(id).populate("category").populate("brand");

    if (!product) {
        return next(new AppError("Product Not Found", 404))
    }

    if (user.role === 'merchant') {
        if (product.brand.owner.toString() !== user._id.toString()) {
            return next(new AppError("You Are Not Authorized To Edit This Product", 401))
        } else {
            brandId = product.brand._id;
        }
    }

    // if (imgUrl) {
    //     await cloudinary.uploader.destroy(product.imgUrl.split("/").pop().split(".")[0]);
    //     const uploadedResponse = await cloudinary.uploader.upload(imgUrl, {
    //         folder: "Products"
    //     });
    //     imgUrl = uploadedResponse.secure_url;
    // }

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

    if (user.role === 'admin') {

        const brandMerchant = await Brand.findById(brandId).populate("owner");

        await Notification.create({
            receivers: [brandMerchant.owner._id], // Changed to receivers array
            sender: "Misrify Store", // Updated to Misrify Store
            content: `Product ${name} has been updated by Misrify Store`, // Changed to content
            type: "product",
            isRead: false,
        })
    }
    res.status(200).json({ success: true, message: "Product Updated Successfully", product })
}

export const deleteProduct = async (req, res, next) => {
    const { id } = req.params;
    const user = req.user;

    const product = await Product.findById(id).populate("category").populate("brand");

    if (!product) {
        return next(new AppError("Product Not Found", 404));
    }

    if (user.role === 'merchant') {
        if (product.brand.owner.toString() !== user._id.toString()) {
            return next(new AppError("You Are Not Authorized To Delete This Product", 401));
        }
    }

    // Delete all comments for each review and then delete the reviews
    if (product.reviews.length > 0) {
        for (const reviewId of product.reviews) {
            const review = await Review.findById(reviewId);
            if (review && Array.isArray(review.comments)) {
                await Comment.deleteMany({ _id: { $in: review.comments } });
            }
            await Review.deleteOne({ _id: reviewId });
        }
    }

    // Delete the product
    await Product.deleteOne({ _id: id });

    // Fetch brand merchant for notification
    if (product.brand) {
        const brandMerchant = await Brand.findById(product.brand).populate("owner");

        // Create notification
        await Notification.create({
            receivers: [brandMerchant.owner._id],
            sender: "Misrify Store",
            content: `Product ${product.name} has been deleted by ${user.name}`,
            type: "product",
            isRead: false,
        });
    }

    res.status(200).json({ success: true, message: "Product Deleted Successfully" });
};

// <<<<<<<<<<<<<<<<< Merchant Functions >>>>>>>>>>>>>>>>>>>>>>>>>>
export const getMerchantProducts = async (req, res, next) => {
    const merchantId = req.user._id;
    const merchantBrand = await Brand.findOne({ owner: merchantId, });

    if (!merchantBrand) {
        return next(new AppError("Merchant Does Not Have Any Products", 404))
    }

    const products = await Product.find({ brand: merchantBrand._id, isApproved: true }).populate("category")
        .populate("brand")
        .exec();

    if (!products || products.length === 0) {
        return next(new AppError("No Products Found", 404))
    }

    res.status(200).json({ success: true, merchantProducts: products })

}


// <<<<<<<<<<<<<<<<< User Functions >>>>>>>>>>>>>>>>>>>>>>>>>>

export const getAllApprovedProducts = async (req, res, next) => {
    const products = await Product.find({ isApproved: true })
        .populate("category")
        .populate("brand")
        .populate("reviews")
        .exec();

    if (!products || products.length === 0) {
        return next(new AppError("No Approved Products Found", 404));
    }

    res.status(200).json({ success: true, products });
};

export const searchProducts = async (req, res, next) => {
    const { query, filterBy } = req.query;

    if (!query) {
        return next(new AppError("Search Query is Required", 400));
    }

    let filter = { isApproved: true };
    let brand = null;
    let category = null;

    if (!filterBy || filterBy === "brand" || filterBy === "category") {
        [brand, category] = await Promise.all([
            filterBy !== "category" ? Brand.findOne({ name: { $regex: query, $options: "i" } }) : null,
            filterBy !== "brand" ? Category.findOne({ name: { $regex: query, $options: "i" } }) : null,
        ]);
    }

    if (filterBy === "name") {
        filter.name = { $regex: query, $options: "i" };
    } else if (filterBy === "brand") {
        if (!brand) return next(new AppError("No Brand Found Matching Your Search", 404));
        filter.brand = brand._id;
    } else if (filterBy === "category") {
        if (!category) return next(new AppError("No Category Found Matching Your Search", 404));
        filter.category = category._id;
    } else {
        filter.$or = [
            { name: { $regex: query, $options: "i" } },
            brand ? { brand: brand._id } : null,
            category ? { category: category._id } : null,
        ].filter(Boolean);
    }

    const products = await Product.find(filter)
        .populate("category")
        .populate("brand")
        .exec();

    if (!products || products.length === 0) {
        return next(new AppError("No Products Found Matching Your Search", 404));
    }

    res.status(200).json({ success: true, products });
};

export const filterProducts = async (req, res, next) => {
    const { size, brand, category, minPrice, maxPrice } = req.query;
    let filter = { isApproved: true };

    if (size) {
        if (!["S", "M", "L", "XL", "XXL"].includes(size.toUpperCase())) {
            return res.status(400).json({ success: false, message: "Invalid size value" });
        }
        filter.size = size.toUpperCase();
    }

    if (brand || category) {
        const [brandData, categoryData] = await Promise.all([
            brand ? Brand.findOne({ name: { $regex: brand, $options: "i" } }) : null,
            category ? Category.findOne({ name: { $regex: category, $options: "i" } }) : null,
        ]);

        if (brand && !brandData) return res.status(404).json({ success: false, message: "Brand not found" });
        if (category && !categoryData) return res.status(404).json({ success: false, message: "Category not found" });

        if (brandData) filter.brand = brandData._id;
        if (categoryData) filter.category = categoryData._id;
    }

    const min = parseFloat(minPrice);
    const max = parseFloat(maxPrice);

    if (minPrice && (isNaN(min) || min < 0)) {
        return res.status(400).json({ success: false, message: "Invalid minPrice value" });
    }
    if (maxPrice && (isNaN(max) || max < 0)) {
        return res.status(400).json({ success: false, message: "Invalid maxPrice value" });
    }
    if (minPrice && maxPrice && min > max) {
        return res.status(400).json({ success: false, message: "minPrice cannot be greater than maxPrice" });
    }

    if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = min;
        if (maxPrice) filter.price.$lte = max;
    }

    const products = await Product.find(filter)
        .populate("category")
        .populate("brand")
        .exec();

    if (!products.length) {
        return res.status(404).json({ success: false, message: "No products found matching your filters" });
    }

    res.status(200).json({ success: true, products });
};