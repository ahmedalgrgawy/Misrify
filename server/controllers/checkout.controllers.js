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
        .populate({
            path: 'orderItems',
            populate: {
                path: 'product',
                select: 'name imgUrl'
            }
        });

    if (!orders || orders.length === 0) {
        return next(new AppError("User Does Not Have orders yet", 404))
    }

    res.status(200).json({ message: "User orders", orders })
}

export const getOrderById = async (req, res, next) => {
    const id = req.params.id;

    if (!id) {
        return next(new AppError("Order Id Must Be Provided", 400))
    }

    const order = await Order.findById(id)
        .populate({
            path: 'orderItems',
            populate: {
                path: 'product',
                select: 'name imgUrl'
            }
        });

    if (!order) {
        return next(new AppError("Order Not Found", 404))
    }

    res.status(200).json({ message: "Order", order })
}

export const placeOrder = async (req, res, next) => {

    const {
        orderItems,
        shippingAddress,
        shippingMethod,
        coupon,
    } = req.body;

    const orderItemsIds = [];
    let totalPrice = 0;

    for (const item of orderItems) {
        const product = await Product.findById(item.product);

        if (!product) {
            return next(new AppError("Product is not found", 404))
        }

        // Add inventory check if needed
        if (product.quantityInStock < item.quantity) {
            return next(new AppError(`Insufficient stock for ${product.name}`, 400))
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

export const updateOrder = async (req, res, next) => {
    const orderId = req.params.id;
    const { shippingAddress, shippingMethod, orderItems, itemOperations } = req.body;

    const order = await Order.findById(orderId)

    if (!order) {
        return next(new AppError('Order not found', 404));
    }

    // Check if user owns the order or is admin
    if (order.user.toString() !== req.user._id.toString()) {
        return next(new AppError('Not authorized to edit this order', 403));
    }

    // Check if order can be edited (only pending orders can be edited)
    if (order.status !== 'pending') {
        return next(new AppError('Only pending orders can be edited', 400));
    }

    // Update order fields if provided
    order.shippingAddress = shippingAddress || order.shippingAddress;
    order.shippingMethod = shippingMethod || order.shippingMethod;

    // Handle item operations (add, update, delete)
    if (itemOperations && itemOperations.length > 0) {
        for (const operation of itemOperations) {
            const { type, orderItemId, productId, quantity, color, size } = operation;

            switch (type) {
                case 'add':
                    // Validate required fields for adding a new item
                    if (!productId || !quantity) {
                        return next(new AppError('Product ID and quantity required to add an item', 400));
                    }

                    // Get the product to check stock and get price
                    const newProduct = await Product.findById(productId);
                    if (!newProduct) {
                        return next(new AppError(`Product with ID ${productId} not found`, 404));
                    }

                    // Check stock
                    if (newProduct.quantityInStock < quantity) {
                        return next(new AppError(`Insufficient stock for ${newProduct.name}`, 400));
                    }

                    // Create a new order item
                    const newOrderItem = await OrderItem.create({
                        product: productId,
                        quantity,
                        price: newProduct.price * quantity,
                        color: color || undefined,
                        size: size || undefined
                    });

                    // Add to order's orderItems array
                    order.orderItems.push(newOrderItem._id);
                    break;

                case 'update':
                    // Validate required fields for updating
                    if (!orderItemId) {
                        return next(new AppError('Order item ID required for update operation', 400));
                    }

                    // Find the order item
                    const orderItem = await OrderItem.findById(orderItemId);
                    if (!orderItem) {
                        return next(new AppError(`Order item with ID ${orderItemId} not found`, 404));
                    }

                    // Verify this order item belongs to the current order
                    const orderItemBelongsToOrder = order.orderItems.some(
                        item => item.toString() === orderItemId
                    );

                    if (!orderItemBelongsToOrder) {
                        return next(new AppError(`Order item does not belong to this order`, 400));
                    }

                    // Get the product to check stock and get price
                    const product = await Product.findById(orderItem.product);
                    if (!product) {
                        return next(new AppError('Product associated with order item not found', 404));
                    }

                    // Update quantity if provided and check stock
                    if (quantity !== undefined) {
                        if (product.quantityInStock < quantity) {
                            return next(new AppError(`Insufficient stock for ${product.name}`, 400));
                        }
                        orderItem.quantity = quantity;
                        orderItem.price = product.price * quantity;
                    }

                    // Update color if provided
                    if (color !== undefined) {
                        orderItem.color = color;
                    }

                    // Update size if provided
                    if (size !== undefined) {
                        orderItem.size = size;
                    }

                    // Save the updated order item
                    await orderItem.save();
                    break;

                case 'delete':
                    // Validate required fields for deletion
                    if (!orderItemId) {
                        return next(new AppError('Order item ID required for delete operation', 400));
                    }

                    // Verify this order item belongs to the current order
                    const itemBelongsToOrder = order.orderItems.some(
                        item => item.toString() === orderItemId
                    );

                    if (!itemBelongsToOrder) {
                        return next(new AppError(`Order item does not belong to this order`, 400));
                    }

                    // Remove from order's orderItems array
                    order.orderItems = order.orderItems.filter(
                        item => item.toString() !== orderItemId
                    );

                    // Delete the order item
                    await OrderItem.findByIdAndDelete(orderItemId);
                    break;

                default:
                    return next(new AppError(`Unknown operation type: ${type}`, 400));
            }
        }
    }

    // Handle backward compatibility for updating existing items
    if (orderItems && orderItems.length > 0) {
        for (const item of orderItems) {
            const { orderItemId, quantity, color, size } = item;

            // Find the order item
            const orderItem = await OrderItem.findById(orderItemId);

            if (!orderItem) {
                return next(new AppError(`Order item with ID ${orderItemId} not found`, 404));
            }

            // Verify this order item belongs to the current order
            const orderItemBelongsToOrder = order.orderItems.some(
                item => item.toString() === orderItemId
            );

            if (!orderItemBelongsToOrder) {
                return next(new AppError(`Order item does not belong to this order`, 400));
            }

            // Get the product to check stock and get price
            const product = await Product.findById(orderItem.product);

            if (!product) {
                return next(new AppError('Product associated with order item not found', 404));
            }

            // Update quantity if provided and check stock
            if (quantity !== undefined) {
                if (product.quantityInStock < quantity) {
                    return next(new AppError(`Insufficient stock for ${product.name}`, 400));
                }
                orderItem.quantity = quantity;
                orderItem.price = product.price * quantity;
            }

            // Update color if provided
            if (color) {
                orderItem.color = color;
            }

            // Update size if provided
            if (size) {
                orderItem.size = size;
            }

            // Save the updated order item
            await orderItem.save();
        }
    }

    // Recalculate total price for the entire order
    const updatedOrderItems = await OrderItem.find({
        _id: { $in: order.orderItems }
    });

    const totalPrice = updatedOrderItems.reduce((sum, item) => sum + item.price, 0);

    // Apply coupon if it exists
    if (order.coupon) {
        const coupon = await Coupon.findById(order.coupon);
        if (coupon) {
            order.totalPrice = totalPrice * (1 - coupon.discount / 100);
        } else {
            order.totalPrice = totalPrice;
        }
    } else {
        order.totalPrice = totalPrice;
    }

    // Save the updated order
    await order.save();

    // Return the updated order with populated fields
    const updatedOrder = await Order.findById(orderId)
        .populate({
            path: 'orderItems',
            populate: {
                path: 'product',
            }
        })
        .populate('coupon', 'code discount');

    res.status(200).json({
        success: true,
        order: updatedOrder
    });
};

export const cancelOrder = async (req, res, next) => {
    const { id } = req.params;

    if (!id) {
        return next(new AppError('Order ID is required', 400));
    }

    const order = await Order.findById(id);

    if (!order) {
        return next(new AppError('Order not found', 404));
    }

    // Check if user owns the order or is admin
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return next(new AppError('Not authorized to cancel this order', 403));
    }

    if (order.status !== 'pending') {
        return next(new AppError('Only pending orders can be canceled', 400));
    }

    // order.status = 'canceled';
    // await order.save();

    // It will be automated later

    await Order.findByIdAndDelete(id);

    res.status(200).json({
        success: true,
        message: 'Order canceled successfully'
    });
}