import express from 'express'
import catchAsync from '../errors/catchAsync.js'
import { adminRoute, protectedRoute } from '../middlewares/auth.middlewares.js'
import { createUser, deleteUser, editUser, getAllMerchants, getAllUsers } from '../controllers/user.controllers.js'
import { validate } from '../services/validate.service.js'
import { createUserSchema, editUserSchema } from '../validators/userValidator.js'
import { approveOrRejectProduct, createProduct, deleteProduct, editProduct, getProducts, getRequestedProducts } from '../controllers/product.controllers.js'
import { createBrand, deleteBrand, editBrand, getBrands } from '../controllers/brand.controllers.js'
import { createCategory, deleteCategory, editCategory, getAllCategories } from '../controllers/categories.controllers.js'
import { editBrandSchema, createBrandSchema } from '../validators/brandValidator.js'
import { createCategorySchema } from '../validators/categoryValidator.js'
import { createProductSchema, editProductSchema } from '../validators/productValidator.js'
import { deleteComment } from '../controllers/comment.controllers.js'
import {createTeamMember, getAllTeamMembers, getTeamMemberById, updateTeamMember, deleteTeamMember} from "../controllers/team.controllers.js";

const router = express.Router()

// Handling Users
router.get("/users", catchAsync(protectedRoute), catchAsync(adminRoute), catchAsync(getAllUsers))

router.get("/merchants", catchAsync(protectedRoute), catchAsync(adminRoute), catchAsync(getAllMerchants))

router.post("/create-user", catchAsync(protectedRoute), catchAsync(adminRoute), validate(createUserSchema), catchAsync(createUser))

router.put("/edit-user/:id", catchAsync(protectedRoute), catchAsync(adminRoute), catchAsync(editUser))

router.delete("/delete-user/:id", catchAsync(protectedRoute), catchAsync(adminRoute), validate(editUserSchema), catchAsync(deleteUser))

// Handling Categories
router.get("/categories", catchAsync(protectedRoute), catchAsync(adminRoute), catchAsync(getAllCategories))

router.post("/create-category", catchAsync(protectedRoute), catchAsync(adminRoute), validate(createCategorySchema), catchAsync(createCategory))

router.put("/edit-category/:id", catchAsync(protectedRoute), catchAsync(adminRoute), catchAsync(editCategory))

router.delete("/delete-category/:id", catchAsync(protectedRoute), catchAsync(adminRoute), catchAsync(deleteCategory))

// Handling Brands
router.get("/brands", catchAsync(protectedRoute), catchAsync(adminRoute), catchAsync(getBrands))

router.post("/create-brand", catchAsync(protectedRoute), catchAsync(adminRoute), validate(createBrandSchema), catchAsync(createBrand))

router.put("/edit-brand/:id", catchAsync(protectedRoute), catchAsync(adminRoute), validate(editBrandSchema), catchAsync(editBrand))

router.delete("/delete-brand/:id", catchAsync(protectedRoute), catchAsync(adminRoute), catchAsync(deleteBrand))

// Handling Products
router.get("/requested-products", catchAsync(protectedRoute), catchAsync(adminRoute), catchAsync(getRequestedProducts))

router.get("/products", catchAsync(protectedRoute), catchAsync(adminRoute), catchAsync(getProducts))

router.post("/create-product", catchAsync(protectedRoute), catchAsync(adminRoute), validate(createProductSchema), catchAsync(createProduct))

router.put("/edit-product/:id", catchAsync(protectedRoute), catchAsync(adminRoute), validate(editProductSchema), catchAsync(editProduct))

router.put("/toggle-product/:id", catchAsync(protectedRoute), catchAsync(adminRoute), catchAsync(approveOrRejectProduct))

router.delete("/delete-product/:id", catchAsync(protectedRoute), catchAsync(adminRoute), catchAsync(deleteProduct))

// Delete Comment
router.delete("/delete-comment/:id", catchAsync(protectedRoute), catchAsync(adminRoute), catchAsync(deleteComment))


export default router;