import express from 'express'
import { customerRoute, protectedRoute } from '../middlewares/auth.middlewares.js';
import { getProfile, updateProfile } from '../controllers/user.controllers.js';
import catchAsync from '../errors/catchAsync.js';
import { validate } from '../services/validate.service.js';
import { updateUserSchema } from '../validators/userValidator.js';
import { getWishlist, toggleWishlist } from '../controllers/wishlist.controllers.js';

const router = express.Router()

// Handling Profile
router.get("/profile", catchAsync(protectedRoute), catchAsync(getProfile))

router.put("/update", catchAsync(protectedRoute), validate(updateUserSchema), catchAsync(updateProfile))

// Handling Wishlist
router.get("/wishlist", catchAsync(protectedRoute), catchAsync(customerRoute), catchAsync(getWishlist))

router.post("/toggle-wishlist", catchAsync(protectedRoute), catchAsync(customerRoute), catchAsync(toggleWishlist))

export default router;