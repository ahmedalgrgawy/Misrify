import express from 'express'
import { merchantRoute, protectedRoute } from '../middlewares/auth.middlewares.js';
import catchAsync from '../errors/catchAsync.js';
import { createProduct, deleteProduct, editProduct, getMerchantProducts } from '../controllers/product.controllers.js';
import { validate } from '../services/validate.service.js';
import { createProductSchema, editProductSchema } from '../validators/productValidator.js';

const router = express.Router()

router.get("/products", catchAsync(protectedRoute), catchAsync(merchantRoute), catchAsync(getMerchantProducts))

router.post("/create-product", catchAsync(protectedRoute), catchAsync(merchantRoute), validate(createProductSchema), catchAsync(createProduct))

router.put("/edit-product/:id", catchAsync(protectedRoute), catchAsync(merchantRoute), validate(editProductSchema), catchAsync(editProduct))

router.delete("/delete-product/:id", catchAsync(protectedRoute), catchAsync(merchantRoute), catchAsync(deleteProduct))

export default router;