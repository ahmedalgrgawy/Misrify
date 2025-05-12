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
        title: "Coupon Created",
        message: `Coupon ${coupon.code} has been created with a discount of ${discount}%`,
        receiver: req.user._id,
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

    // Add the newly created order to the user's purchaseHistory
    await User.findByIdAndUpdate(
        req.user._id,
        { $push: { purchaseHistory: order._id } }, // Push the order ID to purchaseHistory
        { new: true }
    );

    // Populate the order with order items for the response
    const populatedOrder = await Order.findById(order._id)
        .populate({
            path: "orderItems",
            populate: {
                path: "product",
            }
        })
        .populate("coupon", "code discount");

    await Notification.create({
        title: "Order Created",
        message: `Order with ${order.trackCode} has been created with a Price of ${order.totalPrice}`,
        receiver: req.user._id,
        type: "order",
        isRead: false,
    })

    res.status(201).json({
        success: true,
        order: populatedOrder
    });
}

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
    // Get data from either query params or request body
    const data = req.method === 'POST' ? req.body : req.query;
    const { order, success, transaction_id } = data;

    // For Paymob specifically, they might use different parameter names
    const paymobOrderId = order || data.order_id || data.merchant_order_id;
    const isSuccess = success === 'true' || data.is_success === 'true' || data.success === true;
    const transactionId = transaction_id || data.txn_id || data.transaction_id;

    if (!paymobOrderId) {
        return next(new AppError('Missing Paymob order ID', 400));
    }

    // Find the payment by Paymob order ID
    const payment = await Payment.findOne({ 'paymentDetails.paymobOrderId': paymobOrderId });

    if (!payment) {
        return next(new AppError('Payment Not found', 401));
    }

    // Update payment status
    payment.status = isSuccess ? 'success' : 'failed';
    payment.paymentDetails.transactionId = transactionId;
    await payment.save();

    // If payment was successful, update order status
    if (isSuccess) {
        const orderRecord = await Order.findById(payment.order);
        if (orderRecord) {
            orderRecord.status = 'paid';
            await orderRecord.save();
            return res.status(200).json({
                success: true,
                message: 'Payment status updated successfully'
            });
        }
    } else {
        return res.status(400).json({
            success: true,
            message: 'Payment Failed'
        });
    }
};

// export const initializePayment = async (req, res) => {
//     try {
//         // Get user ID from authentication middleware
//         const userId = req.user._id;
//         const { orderId } = req.body;

//         console.log(`Initializing payment for orderId: ${orderId}, userId: ${userId}`);

//         // Find order by ID
//         const order = await Order.findById(orderId).populate('orderItems');
//         if (!order) {
//             console.log(`Order not found: ${orderId}`);
//             return res.status(404).json({
//                 success: false,
//                 message: 'Order not found'
//             });
//         }

//         // Check if order belongs to user
//         if (order.user.toString() !== userId.toString()) {
//             console.log(`Order ${orderId} does not belong to user ${userId}`);
//             return res.status(403).json({
//                 success: false,
//                 message: 'You are not authorized to make payment for this order'
//             });
//         }

//         // Check if order is already paid
//         if (order.status !== 'pending') {
//             console.log(`Order ${orderId} already processed with status: ${order.status}`);
//             return res.status(400).json({
//                 success: false,
//                 message: 'This order is already processed'
//             });
//         }

//         console.log(`Processing payment for order: ${orderId}, amount: ${order.totalPrice}`);

//         // Step 1: Authenticate with Paymob to get auth token
//         console.log('Getting Paymob auth token...');
//         let authResponse;
//         try {
//             authResponse = await axios.post(`${PAYMOB_BASE_URL}/auth/tokens`, {
//                 api_key: PAYMOB_API_KEY
//             });
//             console.log('Auth token received successfully');
//         } catch (error) {
//             console.error('Paymob authentication error:', error.response?.data || error.message);
//             return res.status(500).json({
//                 success: false,
//                 message: 'Failed to authenticate with payment gateway',
//                 error: error.response?.data || error.message
//             });
//         }

//         const authToken = authResponse.data.token;

//         // Step 2: Register a transaction (Checkout API)
//         console.log('Creating Paymob checkout order...');
//         let orderResponse;
//         try {
//             orderResponse = await axios.post(`${PAYMOB_BASE_URL}/acceptance/payment_keys`, {
//                 auth_token: authToken,
//                 amount_cents: Math.round(order.totalPrice * 100), // Convert to cents
//                 currency: 'EGP', // Adjust as needed
//                 delivery_needed: false,
//                 items: [],  // Not required for checkout API
//                 order_id: orderId,  // Use your system's order ID directly
//                 expiration: 3600  // Token expiry time in seconds
//             });
//             console.log('Paymob checkout order created successfully');
//         } catch (error) {
//             console.error('Paymob checkout order creation error:', error.response?.data || error.message);
//             return res.status(500).json({
//                 success: false,
//                 message: 'Failed to create checkout order with payment gateway',
//                 error: error.response?.data || error.message
//             });
//         }

//         // Get user information safely with defaults
//         const userEmail = req.user.email || 'customer@example.com';
//         const firstName = req.user.firstName || req.user.name?.split(' ')[0] || 'Customer';
//         const lastName = req.user.lastName || req.user.name?.split(' ').slice(1).join(' ') || 'Customer';
//         const phone = req.user.phone || '00000000000';

//         // Step 3: Create payment token
//         console.log('Creating payment token...');
//         let paymentKeyResponse;
//         try {
//             paymentKeyResponse = await axios.post(`${PAYMOB_BASE_URL}/acceptance/payment_keys`, {
//                 auth_token: authToken,
//                 amount_cents: Math.round(order.totalPrice * 100),
//                 expiration: 3600,
//                 order_id: orderResponse.data.id,
//                 billing_data: {
//                     apartment: 'NA',
//                     email: userEmail,
//                     floor: 'NA',
//                     first_name: firstName,
//                     street: 'NA',
//                     building: 'NA',
//                     phone_number: phone,
//                     shipping_method: order.shippingMethod || 'NA',
//                     postal_code: 'NA',
//                     city: 'NA',
//                     country: 'EG',
//                     last_name: lastName,
//                     state: 'NA'
//                 },
//                 currency: 'EGP',
//                 integration_id: parseInt(PAYMOB_INTEGRATION_ID),
//                 lock_order_when_paid: true
//             });
//             console.log('Payment token created successfully');
//         } catch (error) {
//             console.error('Payment token creation error:', error.response?.data || error.message);
//             return res.status(500).json({
//                 success: false,
//                 message: 'Failed to create payment token',
//                 error: error.response?.data || error.message
//             });
//         }

//         const paymentToken = paymentKeyResponse.data.token;
//         console.log(`Payment token: ${paymentToken}`);

//         // Create a pending payment record in database
//         console.log('Creating payment record in database...');
//         const payment = new Payment({
//             user: userId,
//             order: order._id,
//             status: 'pending',
//             method: 'paymob_iframe',
//             paymentDetails: {
//                 paymobOrderId: orderResponse.data.id,
//                 provider: 'paymob',
//                 amount: order.totalPrice
//             }
//         });

//         await payment.save();
//         console.log(`Payment record created with ID: ${payment._id}`);

//         // Generate the iframe URL
//         const iframeUrl = `https://accept.paymob.com/api/acceptance/iframes/${PAYMOB_IFRAME_ID}?payment_token=${paymentToken}`;
//         console.log(`Iframe URL: ${iframeUrl}`);

//         // Return response with URL to redirect client
//         return res.status(200).json({
//             success: true,
//             message: 'Payment initialized successfully',
//             data: {
//                 paymentId: payment._id,
//                 iframeUrl: iframeUrl,
//                 orderId: order._id,
//                 trackCode: order.trackCode
//             }
//         });
//     } catch (error) {
//         console.error('Unexpected error in payment initialization:', error);
//         return res.status(500).json({
//             success: false,
//             message: `Payment initialization failed: ${error.message}`,
//             error: error.stack
//         });
//     }
// };

// export const handlePaymentCallback = async (req, res) => {
//     try {
//         // Log both query params and body to help with debugging
//         console.log('Payment callback received - Query:', req.query);
//         console.log('Payment callback received - Body:', req.body);

//         // Paymob can send data via query params, POST body, or transaction_processed webhook
//         const hmacSecret = process.env.PAYMOB_HMAC_SECRET || '';

//         // Handle different callback types
//         let paymentData = {};
//         if (req.body && req.body.obj) {
//             // This is the transaction_processed webhook format
//             console.log('Processing transaction_processed webhook');
//             paymentData = req.body.obj;
//         } else if (req.query && req.query.id) {
//             // This is the response callback format
//             console.log('Processing response callback');
//             paymentData = req.query;
//         } else if (req.body && req.body.id) {
//             // This might be a direct POST callback
//             console.log('Processing direct POST callback');
//             paymentData = req.body;
//         } else {
//             console.log('Unknown callback format', { query: req.query, body: req.body });
//             return res.status(400).json({ success: false, message: 'Invalid callback data' });
//         }

//         // Extract relevant data
//         const orderId = paymentData.order?.id || paymentData.order_id || paymentData.merchant_order_id;
//         const success = paymentData.success === 'true' || paymentData.success === true || paymentData.is_success === true;
//         const transactionId = paymentData.id || paymentData.transaction_id;

//         if (!orderId) {
//             console.log('No order ID found in callback data');
//             return res.redirect(`${CLIENT_FAILURE_URL}?error=missing_order_id`);
//         }

//         // Find the payment by Paymob order ID
//         const payment = await Payment.findOne({ 'paymentDetails.paymobOrderId': orderId });

//         if (!payment) {
//             console.log(`Payment not found for Paymob order ID: ${orderId}`);
//             return res.redirect(`${CLIENT_FAILURE_URL}?error=payment_not_found`);
//         }

//         console.log(`Found payment record: ${payment._id}`);

//         // Update payment status
//         payment.status = success ? 'success' : 'failed';
//         payment.paymentDetails.transactionId = transactionId;
//         payment.paymentDetails.rawResponse = JSON.stringify(paymentData);
//         await payment.save();
//         console.log(`Updated payment status to: ${payment.status}`);

//         // If payment was successful, update order status
//         if (success) {
//             const orderRecord = await Order.findById(payment.order);
//             if (orderRecord) {
//                 orderRecord.status = 'paid';
//                 await orderRecord.save();
//                 console.log(`Updated order status to paid: ${orderRecord._id}`);

//                 // For API callbacks, respond with JSON
//                 if (req.headers['accept'] === 'application/json') {
//                     return res.status(200).json({
//                         success: true,
//                         message: 'Payment processed successfully',
//                         orderId: orderRecord._id,
//                         trackCode: orderRecord.trackCode
//                     });
//                 }

//                 // For browser callbacks, redirect
//                 return res.redirect(`${CLIENT_SUCCESS_URL}?order=${orderRecord._id}&track=${orderRecord.trackCode}`);
//             }
//         }

//         // For API callbacks
//         if (req.headers['accept'] === 'application/json') {
//             return res.status(200).json({
//                 success: false,
//                 message: 'Payment processing failed',
//                 paymentId: payment._id
//             });
//         }

//         // For browser callbacks
//         return res.redirect(`${CLIENT_FAILURE_URL}?payment=${payment._id}`);
//     } catch (error) {
//         console.error('Error in payment callback:', error);

//         // For API callbacks
//         if (req.headers['accept'] === 'application/json') {
//             return res.status(500).json({
//                 success: false,
//                 message: 'Payment callback processing error',
//                 error: error.message
//             });
//         }

//         // For browser callbacks
//         return res.redirect(`${CLIENT_FAILURE_URL}?error=callback_error`);
//     }
// };