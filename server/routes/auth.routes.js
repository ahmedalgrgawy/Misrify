import express from "express"
import { checkAuth, forgotPassword, login, logout, reCreateAccessToken, resetPassword, signup, verifyEmail } from "../controllers/auth.controllers.js";
import { protectedRoute } from "../middlewares/auth.middlewares.js";
import catchAsync from "../utils/catchAsync.js";

const router = express.Router()

router.get("/check-auth", protectedRoute, catchAsync(checkAuth))

router.post("/signup", catchAsync(signup))

router.post("/verify-email", catchAsync(verifyEmail))

router.post("/login", catchAsync(login))

router.post("/forgot-password", catchAsync(forgotPassword))

router.post("/reset-password", catchAsync(resetPassword))

router.post("/logout", catchAsync(logout))

router.post("/refresh-token", catchAsync(reCreateAccessToken))

export default router;
