import express from "express"
import { checkAuth, forgotPassword, login, logout, reCreateAccessToken, resetPassword, signup, verifyEmail } from "../controllers/auth.controllers.js";
import { protectedRoute } from "../middlewares/auth.middlewares.js";
import { validate } from "../services/validate.service.js";
import { forgotPasswordValidationSchema, loginValidationSchema, resetPasswordValidationSchema, signupValidationSchema, verifyEmailValidationSchema } from "../validators/userValidator.js";
import catchAsync from "../errors/catchAsync.js";

const router = express.Router()

router.get("/check-auth", catchAsync(protectedRoute), catchAsync(checkAuth))

router.post("/signup", validate(signupValidationSchema), catchAsync(signup))

router.post("/verify-email", validate(verifyEmailValidationSchema), catchAsync(verifyEmail))

router.post("/login", validate(loginValidationSchema), catchAsync(login))

router.post("/forgot-password", validate(forgotPasswordValidationSchema), catchAsync(forgotPassword))

router.post("/reset-password", validate(resetPasswordValidationSchema), catchAsync(resetPassword))

router.post("/logout", catchAsync(logout))

router.post("/refresh-token", catchAsync(reCreateAccessToken))

export default router;