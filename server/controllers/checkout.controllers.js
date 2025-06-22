import AppError from "../errors/AppError.js";
import User from "../models/user.model.js"
import { v4 as uuidv4 } from "uuid"; // To generate unique coupon codes
import { calculateDiscount } from "../utils/generators.js";
import Coupon from "../models/coupon.model.js";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import OrderItem from "../models/orderItem.model.js";
import { CLIENT_FAILURE_URL, CLIENT_SUCCESS_URL, PAYMOB_API_KEY, PAYMOB_BASE_URL, PAYMOB_IFRAME_ID, PAYMOB_INTEGRATION_ID } from "../lib/paymob.js";
import Payment from "../models/payment.model.js";
import axios from "axios";
import Notification from "../models/notification.model.js";
import mongoose from "mongoose"
import {calculatePoints} from "../utils/generators.js";


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

    await Notification.create({
        receivers: [req.user._id], // Changed to receivers array
        sender: "Misrify Store",
        content: `Coupon ${coupon.code} has been created with a discount of ${discount}%`, // Changed from message to content
        type: "coupon",
        isRead: false,
    })

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

// ... earlier code above remains unchanged
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
            return next(new AppError("Product is not found", 404));
        }

        if (product.quantityInStock < item.quantity) {
            return next(new AppError(`Insufficient stock for ${product.name}`, 400));
        }

        const roundedPrice = Math.round(item.price * 100) / 100;

        const orderItem = await OrderItem.create({
            product: item.product,
            quantity: item.quantity,
            color: item.color,
            size: item.size,
            price: roundedPrice,
        });

        orderItemsIds.push(orderItem._id);
        totalPrice += roundedPrice * item.quantity;
    }

    const hasPreviousOrders = await Order.exists({ user: req.user._id });
    const shippingFee = hasPreviousOrders ? 60 : 0;

    let appliedCoupon = null;
    let couponDiscount = 0;

    if (coupon) {
        const couponDb = await Coupon.findOne({ code: coupon });
        if (couponDb && couponDb.isActive) {
            couponDiscount = couponDb.discount;
            appliedCoupon = couponDb._id;
            couponDb.isActive = false;
            await couponDb.save();
        }
    }

    // ✅ Apply coupon after adding shipping
    const totalBeforeCoupon = totalPrice + shippingFee;
    let finalTotal = totalBeforeCoupon;

    if (couponDiscount > 0) {
        finalTotal = totalBeforeCoupon * (1 - couponDiscount / 100);
    }

    const finalPrice = Math.round(finalTotal * 100) / 100;

    const trackCode = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const order = await Order.create({
        user: req.user._id,
        orderItems: orderItemsIds,
        shippingAddress,
        shippingMethod: shippingMethod || "standard",
        trackCode,
        status: "pending",
        totalPrice: finalPrice,
        coupon: appliedCoupon,
    });

    await User.findByIdAndUpdate(
        req.user._id,
        { $push: { purchaseHistory: order._id } },
        { new: true }
    );

    const populatedOrder = await Order.findById(order._id)
        .populate({
            path: "orderItems",
            populate: {
                path: "product",
            },
        })
        .populate("coupon", "code discount");

    await Notification.create({
        receivers: [req.user._id],
        sender: "Misrify Store",
        content: `Order with ${order.trackCode} has been created with a Price of ${order.totalPrice}`,
        type: "order",
        isRead: false,
    });

    res.status(201).json({
        success: true,
        order: populatedOrder,
    });
};


export const updateOrder = async (req, res, next) => {
    const orderId = req.params.id;
    const { shippingAddress, shippingMethod, orderItems, itemOperations, couponCode } = req.body;

    const order = await Order.findById(orderId);

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

    // Handle coupon application
    if (couponCode) {
        // Find coupon by code
        const coupon = await Coupon.findOne({ code: couponCode });

        if (!coupon) {
            return next(new AppError('Invalid coupon code', 400));
        }

        // Check if coupon is active
        if (!coupon.isActive) {
            return next(new AppError('This coupon is not active', 400));
        }

        // Check if coupon is expired
        const currentDate = new Date();
        if (coupon.expirationDate && new Date(coupon.expirationDate) < currentDate) {
            return next(new AppError('This coupon has expired', 400));
        }

        // Apply coupon to order
        order.coupon = coupon._id;
    }

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

    let totalPrice = updatedOrderItems.reduce((sum, item) => sum + item.price, 0);

    // Apply coupon discount if exists
    if (order.coupon) {
        const couponDb = await Coupon.findById(order.coupon);
        if (couponDb && couponDb.isActive) {
            // Different discount types handling
            totalPrice = totalPrice * (1 - couponDb.discount / 100);
            couponDb.isActive = false;
            await couponDb.save()
        }
    }

    // Update the order total price
    order.totalPrice = totalPrice;

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
        .populate('coupon', 'code discount ');

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

export const initializePayment = async (req, res, next) => {

    // Get user ID from authentication middleware
    const userId = req.user._id;
    const { orderId } = req.body;

    console.log(`Initializing payment for orderId: ${orderId}, userId: ${userId}`);

    // Find order by ID
    const order = await Order.findById(orderId).populate('orderItems');
    if (!order) {
        return next(new AppError("Order not found", 404))
    }

    // Check if order belongs to user
    if (order.user.toString() !== userId.toString()) {
        return next(new AppError("Order not found", 404))
    }

    // Check if order is already paid
    if (order.status !== 'pending') {
        return res.status(400).json({
            success: false,
            message: 'This order is already processed'
        });
    }

    // Step 1: Authenticate with Paymob to get auth token
    let authResponse;
    try {
        authResponse = await axios.post(`${PAYMOB_BASE_URL}/auth/tokens`, {
            api_key: PAYMOB_API_KEY
        });
    } catch (error) {
        console.error('Paymob authentication error:', error.response?.data || error.message);
        return res.status(500).json({
            success: false,
            message: 'Failed to authenticate with payment gateway',
            error: error.response?.data || error.message
        });
    }

    const authToken = authResponse.data.token;

    // Step 2: Create an order on Paymob
    let orderResponse;
    try {
        const orderItems = order.orderItems.map(item => ({
            name: item.product?.name || 'Product',
            amount_cents: Math.round(item.price * 100),
            quantity: item.quantity
        }));

        orderResponse = await axios.post(`${PAYMOB_BASE_URL}/ecommerce/orders`, {
            auth_token: authToken,
            delivery_needed: false,
            amount_cents: Math.round(order.totalPrice * 100), // Convert to cents
            currency: 'EGP', // Adjust as needed
            items: orderItems
        });
    } catch (error) {
        console.error('Paymob order creation error:', error.response?.data || error.message);
        return res.status(500).json({
            success: false,
            message: 'Failed to create order with payment gateway',
            error: error.response?.data || error.message
        });
    }

    const paymobOrderId = orderResponse.data.id;

    // Step 3: Create a payment key
    let paymentKeyResponse;
    try {
        // Get user information safely with defaults
        const userEmail = req.user.email || 'customer@example.com';
        const firstName = req.user.firstName || req.user.name?.split(' ')[0] || 'Customer';
        const lastName = req.user.lastName || req.user.name?.split(' ').slice(1).join(' ') || 'Customer';
        const phone = req.user.phone || '00000000000';

        paymentKeyResponse = await axios.post(`${PAYMOB_BASE_URL}/acceptance/payment_keys`, {
            auth_token: authToken,
            amount_cents: Math.round(order.totalPrice * 100),
            expiration: 3600, // Token expiry time in seconds
            order_id: paymobOrderId,
            billing_data: {
                apartment: 'NA',
                email: userEmail,
                floor: 'NA',
                first_name: firstName,
                street: 'NA',
                building: 'NA',
                phone_number: phone,
                shipping_method: order.shippingMethod || 'NA',
                postal_code: 'NA',
                city: 'NA',
                country: 'EG', // Default to Egypt
                last_name: lastName,
                state: 'NA'
            },
            currency: 'EGP', // Adjust as needed
            integration_id: parseInt(PAYMOB_INTEGRATION_ID), // Make sure it's an integer
            lock_order_when_paid: true
        });
    } catch (error) {
        console.error('Payment key creation error:', error.response?.data || error.message);
        return res.status(500).json({
            success: false,
            message: 'Failed to create payment key',
            error: error.response?.data || error.message
        });
    }

    const paymentToken = paymentKeyResponse.data.token;

    // Create a pending payment record in database
    const payment = new Payment({
        user: userId,
        order: order._id,
        status: 'pending',
        method: 'paymob_iframe',
        paymentDetails: {
            paymobOrderId: paymobOrderId,
            provider: 'paymob',
            amount: order.totalPrice
        }
    });

    await payment.save();

    // Generate the iframe URL
    const iframeUrl = `https://accept.paymob.com/api/acceptance/iframes/${PAYMOB_IFRAME_ID}?payment_token=${paymentToken}`;

    // Return response with URL to redirect client
    return res.status(200).json({
        success: true,
        message: 'Payment initialized successfully',
        data: {
            paymentId: payment._id,
            iframeUrl: iframeUrl,
            orderId: order._id,
            trackCode: order.trackCode
        }
    });
};

export const handlePaymentCallback = async (req, res, next) => {
    const { id: transactionId, order: paymobOrderId, success } = req.body;

    let points = 0;

    // Validate required parameters
    if (!paymobOrderId || !transactionId || success === undefined) {
        return next(new AppError('Missing required Paymob parameters', 400));
    }

    // Determine payment status
    const isPaymentSuccessful = success === true || success === 'true';

    // Start a Mongoose transaction
    const session = await mongoose.startSession();
    try {
        session.startTransaction();

        // Find payment by Paymob order ID
        const paymentDoc = await Payment.findOne(
            { 'paymentDetails.paymobOrderId': paymobOrderId },
            null,
            { session }
        );

        if (!paymentDoc) {
            await session.abortTransaction();
            return next(new AppError('Payment record not found', 404));
        }

        // Update payment record
        paymentDoc.status = isPaymentSuccessful ? 'success' : 'failed';
        paymentDoc.paymentDetails.transactionId = transactionId;
        await paymentDoc.save({ session });

        // Update order status if payment is successful
        if (isPaymentSuccessful) {
            const orderDoc = await Order.findById(paymentDoc.order, null, { session });
            if (!orderDoc) {
                await session.abortTransaction();
                return next(new AppError('Order not found', 404));
            }
            if (orderDoc.status !== 'pending') {
                await session.abortTransaction();
                return next(new AppError('Order is not in a payable state', 400));
            }
            orderDoc.status = 'paid';

            points = calculatePoints(orderDoc.totalPrice);
            const user = await User.findById(orderDoc.user, null, { session });

            user.points = (user.points || 0) + points;
            await user.save({ session });

            await orderDoc.save({ session });
        }

        // Commit transaction
        await session.commitTransaction();

        // Respond with success
        return res.status(200).json({
            success: true,
            message: isPaymentSuccessful
                ? 'Payment processed successfully'
                : 'Payment failed and recorded',
            points
        });
    } catch (error) {
        await session.abortTransaction();
        console.error('Payment callback error:', error.message);
        return next(new AppError('Failed to process payment callback', 500));
    } finally {
        session.endSession();
    }
};