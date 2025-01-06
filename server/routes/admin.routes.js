import express from 'express'
import catchAsync from '../errors/catchAsync.js'
import { adminRoute, protectedRoute } from '../middlewares/auth.middlewares.js'
import { createUser, deleteUser, editUser, getAllMerchants, getAllUsers } from '../controllers/user.controllers.js'
import { validate } from '../services/validate.service.js'
import { createUserSchema, editUserSchema } from '../validators/userValidator.js'

const router = express.Router()

// Handling Users
router.get("/users", catchAsync(protectedRoute), catchAsync(adminRoute), catchAsync(getAllUsers))

router.get("/merchants", catchAsync(protectedRoute), catchAsync(adminRoute), catchAsync(getAllMerchants))

router.post("/create-user", catchAsync(protectedRoute), catchAsync(adminRoute), validate(createUserSchema), catchAsync(createUser))

router.put("/edit-user/:id", catchAsync(protectedRoute), catchAsync(adminRoute), catchAsync(editUser))

router.delete("/delete-user/:id", catchAsync(protectedRoute), catchAsync(adminRoute), validate(editUserSchema), catchAsync(deleteUser))

// Handling Categories & Brands
// Handling Products

export default router;