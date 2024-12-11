import express from "express"
import { checkAuth, forgotPassword, login, logout, reCreateAccessToken, resetPassword, signup, verifyEmail } from "../controllers/auth.controllers.js";
import { protectedRoute } from "../middlewares/auth.middlewares.js";

const router = express.Router()

router.get("/check-auth", protectedRoute, checkAuth)

router.post("/signup", signup)

router.post("/verify-email", verifyEmail)

router.post("/login", login)

router.post("/forgot-password", forgotPassword)

router.post("/reset-password", resetPassword)

router.post("/logout", logout)

router.post("/refresh-token", reCreateAccessToken)

export default router;
