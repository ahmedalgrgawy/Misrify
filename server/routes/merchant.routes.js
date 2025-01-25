import express from 'express'
import { merchantRoute, protectedRoute } from '../middlewares/auth.middlewares.js';
import catchAsync from '../errors/catchAsync.js';
import { createProduct, getMerchantProducts } from '../controllers/product.controllers.js';
import { validate } from '../services/validate.service.js';
import { createProductSchema } from '../validators/productValidator.js';

const router = express.Router()

router.get("/products", catchAsync(protectedRoute), catchAsync(merchantRoute), catchAsync(getMerchantProducts))

router.post("/create-product", catchAsync(protectedRoute), catchAsync(merchantRoute), validate(createProductSchema), catchAsync(createProduct))
export default router;