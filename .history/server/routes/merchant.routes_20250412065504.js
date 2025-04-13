import express from 'express'
import { merchantRoute, protectedRoute } from '../middlewares/auth.middlewares.js';
import catchAsync from '../errors/catchAsync.js';
import { createProduct, deleteProduct, editProduct, getMerchantProducts } from '../controllers/product.controllers.js';
import { validate } from '../services/validate.service.js';
import { createProductSchema, editProductSchema } from '../validators/productValidator.js';
import { createComment } from '../controllers/comment.controllers.js';
import { getStockLevel, getProductsWithAvgRatings } from '../controllers/merchantAnalytics.controller.js';

const router = express.Router()

// Handling Products
router.get("/products", catchAsync(protectedRoute), catchAsync(merchantRoute), catchAsync(getMerchantProducts))

router.post("/create-product", catchAsync(protectedRoute), catchAsync(merchantRoute), validate(createProductSchema), catchAsync(createProduct))

router.put("/edit-product/:id", catchAsync(protectedRoute), catchAsync(merchantRoute), validate(editProductSchema), catchAsync(editProduct))

router.delete("/delete-product/:id", catchAsync(protectedRoute), catchAsync(merchantRoute), catchAsync(deleteProduct))

// Handling Comments & Reviews
router.post("/create-comment", catchAsync(protectedRoute), catchAsync(merchantRoute), catchAsync(createComment))

// Handling Merchant Analytics 
router.get("/stock-level", catchAsync(protectedRoute), catchAsync(merchantRoute), catchAsync(getStockLevel))
router.get("/products-with-ratings", catchAsync(protectedRoute), catchAsync(merchantRoute), catchAsync(getProductsWithAvgRatings))



export default router;