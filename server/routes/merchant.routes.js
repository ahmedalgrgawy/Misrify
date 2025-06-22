import express from 'express'
import { merchantRoute, protectedRoute } from '../middlewares/auth.middlewares.js';
import catchAsync from '../errors/catchAsync.js';
import { createProduct, deleteProduct, editProduct, getMerchantProducts } from '../controllers/product.controllers.js';
import { validate } from '../services/validate.service.js';
import { createProductSchema, editProductSchema } from '../validators/productValidator.js';
import { createComment } from '../controllers/comment.controllers.js';
import { getStockLevel, getProductsWithAvgRatings, getMerchantOrdersStats, getSalesGrowth, getMerchantOrderTrends, getMerchantSalesTrends, getMerchantOrders } from '../controllers/merchantAnalytics.controllers.js';
import { getMerchantReviews } from '../controllers/review.controllers.js';

const router = express.Router()

// Handling Products
router.get("/products", catchAsync(protectedRoute), catchAsync(merchantRoute), catchAsync(getMerchantProducts))

router.post("/create-product", catchAsync(protectedRoute), catchAsync(merchantRoute), validate(createProductSchema), catchAsync(createProduct))

router.put("/edit-product/:id", catchAsync(protectedRoute), catchAsync(merchantRoute), validate(editProductSchema), catchAsync(editProduct))

router.delete("/delete-product/:id", catchAsync(protectedRoute), catchAsync(merchantRoute), catchAsync(deleteProduct))

// Handling Comments & Reviews
router.post("/create-comment", catchAsync(protectedRoute), catchAsync(merchantRoute), catchAsync(createComment))
router.get("/reviews", catchAsync(protectedRoute), catchAsync(merchantRoute), catchAsync(getMerchantReviews))

// Handling Merchant Orders
router.get("/orders", catchAsync(protectedRoute), catchAsync(merchantRoute), catchAsync(getMerchantOrders))

// Handling Merchant Analytics 
router.get("/stock-level", catchAsync(protectedRoute), catchAsync(merchantRoute), catchAsync(getStockLevel))
router.get("/products-with-ratings", catchAsync(protectedRoute), catchAsync(merchantRoute), catchAsync(getProductsWithAvgRatings))
router.get("/merchant-orders-stats", catchAsync(protectedRoute), catchAsync(merchantRoute), catchAsync(getMerchantOrdersStats));
router.get("/stock-level", catchAsync(protectedRoute), catchAsync(merchantRoute), getStockLevel);
router.get("/products-with-ratings", catchAsync(protectedRoute), catchAsync(merchantRoute), getProductsWithAvgRatings);
router.get("/merchant-orders-stats", catchAsync(protectedRoute), catchAsync(merchantRoute), getMerchantOrdersStats);
router.get("/sales-growth", catchAsync(protectedRoute), catchAsync(merchantRoute), getSalesGrowth);
router.get("/sales-trends", catchAsync(protectedRoute), catchAsync(merchantRoute), getMerchantSalesTrends);
router.get("/order-trends", catchAsync(protectedRoute), catchAsync(merchantRoute), getMerchantOrderTrends)

export default router;