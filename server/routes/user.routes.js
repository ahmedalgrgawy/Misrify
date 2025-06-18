import express from 'express'
import { customerRoute, protectedRoute, userAndMerchantRoute } from '../middlewares/auth.middlewares.js';
import { getProfile, updateProfile } from '../controllers/user.controllers.js';
import catchAsync from '../errors/catchAsync.js';
import { validate } from '../services/validate.service.js';
import { updateUserSchema } from '../validators/userValidator.js';
import { getWishlist, toggleWishlist } from '../controllers/wishlist.controllers.js';
import { getAllApprovedProducts, searchProducts, filterProducts } from '../controllers/product.controllers.js';
import { createReview, updateReview, deleteReview } from "../controllers/review.controllers.js";
import { createComment, updateComment, deleteCommentUser, getCommentById } from "../controllers/comment.controllers.js";
import { createReviewSchema, updateReviewSchema } from '../validators/reviewValidator.js';
import { createCommentSchema, updateCommentSchema } from '../validators/commentValidator.js';
import { getCart, addToCart, removeFromCart, updateCartItemQuantity, clearCart } from "../controllers/cart.controllers.js";
import { addToCartSchema, updateCartItemQuantitySchema, removeFromCartSchema, clearCartSchema } from "../validators/cartValidator.js";
import { cancelOrder, exchangePointsForCoupon, getCoupons, getOrderById, getOrders, handlePaymentCallback, initializePayment, placeOrder, updateOrder } from '../controllers/checkout.controllers.js';
import { createOrderSchema, editOrderSchema } from '../validators/checkoutValidator.js';
import { submitContactForm } from "../controllers/contact.controllers.js";
import { contactSchema } from "../validators/contactValidator.js";
import { getUserAnalytics } from "../controllers/userAnalytics.controllers.js";

import { getNotifications, markAsRead, deleteNotification, deleteAllNotifications } from '../controllers/notification.controllers.js';

const router = express.Router()

// Handling Profile
router.get("/profile", catchAsync(protectedRoute), catchAsync(getProfile))

router.put("/update", catchAsync(protectedRoute), validate(updateUserSchema), catchAsync(updateProfile))

// Handling Wishlist
router.get("/wishlist", catchAsync(protectedRoute), catchAsync(customerRoute), catchAsync(getWishlist))

router.post("/toggle-wishlist", catchAsync(protectedRoute), catchAsync(customerRoute), catchAsync(toggleWishlist))

// Get all products for user
router.get('/products', catchAsync(getAllApprovedProducts));

// Handling Search and filter processes 
router.get('/search', catchAsync(searchProducts));
router.get('/filter', catchAsync(filterProducts));

// Handling Reviews (Create, Update, Delete)
router.post("/reviews/create", catchAsync(protectedRoute), catchAsync(customerRoute), validate(createReviewSchema), catchAsync(createReview));
router.put("/reviews/:reviewId", catchAsync(protectedRoute), catchAsync(customerRoute), validate(updateReviewSchema), catchAsync(updateReview));
router.delete("/reviews/:reviewId", catchAsync(protectedRoute), catchAsync(customerRoute), catchAsync(deleteReview));

// Handling Comments (Create, Update, Delete)
router.post("/comments/create", catchAsync(protectedRoute), catchAsync(userAndMerchantRoute), validate(createCommentSchema), catchAsync(createComment));
router.put("/comment/:commentId", catchAsync(protectedRoute), catchAsync(userAndMerchantRoute), validate(updateCommentSchema), catchAsync(updateComment));
router.delete("/comment/:commentId", catchAsync(protectedRoute), catchAsync(userAndMerchantRoute), catchAsync(deleteCommentUser));

//new
router.get("/comments/:id", catchAsync(getCommentById)); // remove protectedRoute temporarily


// Handling Cart (getCart, addTo, remove, update, clear)
router.get("/cart", catchAsync(protectedRoute), catchAsync(customerRoute), catchAsync(getCart));
router.post("/addToCart", catchAsync(protectedRoute), catchAsync(customerRoute), validate(addToCartSchema), catchAsync(addToCart));
router.put("/update-quantity", catchAsync(protectedRoute), catchAsync(customerRoute), validate(updateCartItemQuantitySchema), catchAsync(updateCartItemQuantity));
router.delete("/remove-item", catchAsync(protectedRoute), catchAsync(customerRoute), validate(removeFromCartSchema), catchAsync(removeFromCart));
router.delete("/clear", catchAsync(protectedRoute), catchAsync(customerRoute), validate(clearCartSchema), catchAsync(clearCart));

// Handling Coupons
router.get("/coupon", catchAsync(protectedRoute), catchAsync(customerRoute), catchAsync(getCoupons))
router.post("/coupon/create", catchAsync(protectedRoute), catchAsync(customerRoute), catchAsync(exchangePointsForCoupon))

// Handling Checkout - Payments
router.get("/orders", catchAsync(protectedRoute), catchAsync(customerRoute), catchAsync(getOrders))
router.get("/order/:id", catchAsync(protectedRoute), catchAsync(customerRoute), catchAsync(getOrderById))
router.post("/order", catchAsync(protectedRoute), catchAsync(customerRoute), validate(createOrderSchema), catchAsync(placeOrder))
router.put("/order/:id", catchAsync(protectedRoute), catchAsync(customerRoute), validate(editOrderSchema), catchAsync(updateOrder))
router.delete("/order/:id", catchAsync(protectedRoute), catchAsync(customerRoute), catchAsync(cancelOrder))

router.post("/payment", catchAsync(protectedRoute), catchAsync(customerRoute), catchAsync(initializePayment))
router.post('/payment/callback', catchAsync(handlePaymentCallback));

// Handling contact us
router.post("/contact", validate(contactSchema), catchAsync(submitContactForm));

// Handling User Analytics
router.get("/user-analytics/:userId", catchAsync(protectedRoute), catchAsync(customerRoute), catchAsync(getUserAnalytics));

// Handling Notifications
router.get("/notification", catchAsync(protectedRoute), catchAsync(getNotifications))
router.put("/notification/:id", catchAsync(protectedRoute), catchAsync(markAsRead))
router.delete("/notification/:id", catchAsync(protectedRoute), catchAsync(deleteNotification))
router.delete("/notification", catchAsync(protectedRoute), catchAsync(deleteAllNotifications))
export default router;
