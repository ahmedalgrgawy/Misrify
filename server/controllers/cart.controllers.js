import AppError from "../errors/AppError.js";
import Cart from "../models/cart.model.js";
import CartItem from "../models/cartItem.model.js";
import Product from "../models/product.model.js";

export const getCart = async (req, res, next) => {
    const userId = req.user._id;

    const cart = await Cart.findOne({ user: userId }).populate("cartItems").exec();

    if (!cart) {
        cart = await Cart.create({ user: userId, cartItems: [], totalPrice: 0 });
    }

    if (cart.cartItems.length === 0) {
        return next(new AppError("Cart Is Empty", 200))
    }

    cart.totalPrice = await CartItem.aggregate([
        { $match: { _id: { $in: cart.cartItems } } },
        { $group: { _id: null, total: { $sum: "$total" } } },
    ]).then(result => (result.length > 0 ? result[0].total : 0));

    await cart.save();

    res.status(200).json({ success: true, cart });
};

export const addToCart = async (req, res, next) => {
    const userId = req.user._id;
    const { productId, quantity, color, size } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
        return next(new AppError("Product not found", 404))
    }

    if (product.quantityInStock < quantity) {
        return next(new AppError("Not enough stock available", 400))
    }

    if (product.quantityInStock === 0) {
        return next(new AppError("Product is out Of Stock", 400))
    }

    const price = product.price;

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
        cart = await Cart.create({ user: userId, cartItems: [], totalPrice: 0 });
    }

    let cartItem = await CartItem.findOne({
        _id: { $in: cart.cartItems },
        product: productId,
        color,
        size,
    });

    if (cartItem) {
        cartItem.quantity += quantity;
        cartItem.total = cartItem.quantity * price;
        await cartItem.save();
    } else {
        cartItem = await CartItem.create({
            product: productId,
            quantity,
            color,
            size,
            price,
            total: price * quantity,
        });
        cart.cartItems.push(cartItem._id);
    }

    cart.totalPrice = await CartItem.aggregate([
        { $match: { _id: { $in: cart.cartItems } } },
        { $group: { _id: null, total: { $sum: "$total" } } },
    ]).then(result => (result.length > 0 ? result[0].total : 0));

    await cart.save();

    res.status(200).json({ success: true, message: "Product added to cart", cart });
};


export const removeFromCart = async (req, res, next) => {
    const userId = req.user._id;
    const { cartItemId } = req.body;

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
        return next(new AppError("Cart not found", 404));
    }

    const cartItem = await CartItem.findById(cartItemId);

    if (!cartItem) {
        return next(new AppError("Cart item not found", 404));
    }

    cart.cartItems = cart.cartItems.filter(item => item.toString() !== cartItemId.toString());

    cart.totalPrice -= cartItem.total;

    await cart.save();

    await CartItem.findByIdAndDelete(cartItemId);

    res.status(200).json({ success: true, message: "Product removed from cart", cart });
};

export const updateCartItemQuantity = async (req, res, next) => {
    const userId = req.user._id;
    const { cartItemId, operation } = req.body;

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
        return next(new AppError("Cart not found", 404));
    }

    const cartItem = await CartItem.findById(cartItemId);

    if (!cartItem) {
        return next(new AppError("Cart item not found", 404));
    }

    let change = (operation === "add") ? 1 : -1;

    const oldTotal = cartItem.total;

    cartItem.quantity += change;

    if (cartItem.quantity <= 0) {
        await CartItem.findByIdAndDelete(cartItemId);
        cart.cartItems = cart.cartItems.filter(item => item.toString() !== cartItemId);
    } else {
        cartItem.total = cartItem.price * cartItem.quantity;
        await cartItem.save();
    }

    cart.totalPrice += cartItem.total - oldTotal;

    await cart.save();

    res.status(200).json({ success: true, message: "Cart item quantity updated", cart });
};

export const clearCart = async (req, res, next) => {
    const userId = req.user._id;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
        return next(new AppError("Cart not found", 404));
    }

    await CartItem.deleteMany({ _id: { $in: cart.cartItems } });

    cart.cartItems = [];
    cart.totalPrice = 0;
    await cart.save();

    res.status(200).json({ success: true, message: "Cart cleared", cart });
};