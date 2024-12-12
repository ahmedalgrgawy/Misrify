import express from 'express'
import { protectedRoute } from '../middlewares/auth.middlewares.js';
import { getProfile } from '../controllers/user.controllers.js';

const router = express.Router()

router.get("/profile", protectedRoute, getProfile)

export default router;