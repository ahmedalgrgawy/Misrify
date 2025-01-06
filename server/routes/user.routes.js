import express from 'express'
import { protectedRoute } from '../middlewares/auth.middlewares.js';
import { getProfile, updateProfile } from '../controllers/user.controllers.js';
import catchAsync from '../errors/catchAsync.js';
import { validate } from '../services/validate.service.js';
import { updateUserSchema } from '../validators/userValidator.js';

const router = express.Router()

router.get("/profile", catchAsync(protectedRoute), catchAsync(getProfile))

router.put("/update", catchAsync(protectedRoute), catchAsync(validate(updateUserSchema)), catchAsync(updateProfile))

export default router;