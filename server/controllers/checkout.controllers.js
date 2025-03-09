import AppError from "../errors/AppError.js";
import User from "../models/user.model.js"
import { v4 as uuidv4 } from "uuid"; // To generate unique coupon codes
import { calculateDiscount } from "../utils/generators.js";
import Coupon from "../models/coupon.model.js";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import OrderItem from "../models/orderItem.model.js";


export const getCoupons = async (req, res, next) => {
    const coupons = await Coupon.find({ user: req.user._id });

    if (!coupons || coupons.length === 0) {
        return next(new AppError("User Does Not Have Coupons yet", 404))
    }

    res.status(200).json({ message: "User Coupons", coupons })
}

export const exchangePointsForCoupon = async (req, res, next) => {

    const { points } = req.body;

    if (!points) {
        return next(new AppError("Points must be Provided", 400))
    }

    const user = await User.findById(req.user._id)

    if (user.points < points) {
        return next(new AppError("Not enough points", 400))
    }

    const discount = calculateDiscount(points);

    user.points -= points;
    await user.save();

    const coupon = new Coupon({
        user: user._id,
        code: uuidv4(), // Generates a unique coupon code
        discount: discount,
        expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Expires in 30 days
        usedPoints: points
    });

    await coupon.save();

    return res.status(200).json({
        message: "Coupon Created Successfully",
        coupon,
        discount
    })

}

export const getOrders = async (req, res, next) => {
    const orders = await Order.find({ user: req.user.id })

    if (!orders || orders.length === 0) {
        return next(new AppError("User Does Not Have orders yet", 404))
    }

    res.status(200).json({ message: "User orders", orders })
}

export const placeOrder = async (req, res, next) => {

    const {
        orderItems,
        shippingAddress,
        shippingMethod,
        coupon,
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
        return next(new AppError("No order items provided", 400))
    }

    if (!shippingAddress) {
        return next(new AppError("Shipping address is required", 400))
    }

    const orderItemsIds = [];
    let totalPrice = 0;

    for (const item of orderItems) {
        // Verify product exists and has enough inventory
        const product = await Product.findById(item.product);
        if (!product) {
            throw new Error(`Product ${item.product} not found`);
        }

        // Add inventory check if needed
        if (product.quantityInStock < item.quantity) {
            throw new AppError(`Insufficient stock for ${product.name}`, 400);
        }

        // Create order item
        const orderItem = await OrderItem.create({
            product: item.product,
            quantity: item.quantity,
            color: item.color,
            size: item.size,
            price: product.price * item.quantity,
            // total: item.price * item.quantity
        });

        orderItemsIds.push(orderItem._id);
        totalPrice += product.price * item.quantity
    }

    // Apply coupon if provided
    let finalPrice = totalPrice;
    let appliedCoupon = null;

    if (coupon) {
        const couponDb = await Coupon.findOne({ code: coupon });
        if (couponDb && couponDb.isActive) {
            finalPrice = totalPrice * (1 - couponDb.discount / 100);
            appliedCoupon = couponDb._id;
            couponDb.isActive = false;
            await couponDb.save()
        }
    }

    // Generate tracking code
    const trackCode = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Create the order
    const order = await Order.create({
        user: req.user._id,
        orderItems: orderItemsIds,
        shippingAddress,
        shippingMethod: shippingMethod || "standard",
        trackCode,
        status: "pending",
        totalPrice: finalPrice,
        coupon: appliedCoupon
    });

    // Populate the order with order items for the response
    const populatedOrder = await Order.findById(order._id)
        .populate({
            path: "orderItems",
            populate: {
                path: "product",
            }
        })
        .populate("coupon", "code discount");

    res.status(201).json({
        success: true,
        order: populatedOrder
    });
}