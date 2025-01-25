import express from 'express'
import catchAsync from '../errors/catchAsync.js'
import { adminRoute, protectedRoute } from '../middlewares/auth.middlewares.js'
import { createUser, deleteUser, editUser, getAllMerchants, getAllUsers } from '../controllers/user.controllers.js'
import { validate } from '../services/validate.service.js'
import { createUserSchema, editUserSchema } from '../validators/userValidator.js'
import { getProducts, getRequestedProducts } from '../controllers/product.controllers.js'
import { createBrand, editBrand, getBrands } from '../controllers/brand.controllers.js'
import { getAllCategories } from '../controllers/categories.controllers.js'
import { editBrandSchema, createBrandSchema } from '../validators/brandValidator.js'

const router = express.Router()

// Handling Users
router.get("/users", catchAsync(protectedRoute), catchAsync(adminRoute), catchAsync(getAllUsers))

router.get("/merchants", catchAsync(protectedRoute), catchAsync(adminRoute), catchAsync(getAllMerchants))

router.post("/create-user", catchAsync(protectedRoute), catchAsync(adminRoute), validate(createUserSchema), catchAsync(createUser))

router.put("/edit-user/:id", catchAsync(protectedRoute), catchAsync(adminRoute), catchAsync(editUser))

router.delete("/delete-user/:id", catchAsync(protectedRoute), catchAsync(adminRoute), validate(editUserSchema), catchAsync(deleteUser))

// Handling Categories
router.get("/categories", catchAsync(protectedRoute), catchAsync(adminRoute), catchAsync(getAllCategories))

// Handling Brands
router.get("/brands", catchAsync(protectedRoute), catchAsync(adminRoute), catchAsync(getBrands))

router.post("/create-brand", catchAsync(protectedRoute), catchAsync(adminRoute), validate(createBrandSchema), catchAsync(createBrand))

router.put("/edit-brand/:id", catchAsync(protectedRoute), catchAsync(adminRoute), validate(editBrandSchema), catchAsync(editBrand))

router.delete("/delete-brand/:id", catchAsync(protectedRoute), catchAsync(adminRoute), catchAsync(deleteBrand))

// Handling Products
router.get("/requested-products", catchAsync(protectedRoute), catchAsync(adminRoute), catchAsync(getRequestedProducts))

router.get("/products", catchAsync(protectedRoute), catchAsync(adminRoute), catchAsync(getProducts))

export default router;