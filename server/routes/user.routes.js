import express from 'express'
import { customerRoute, protectedRoute } from '../middlewares/auth.middlewares.js';
import { getProfile, updateProfile } from '../controllers/user.controllers.js';
import catchAsync from '../errors/catchAsync.js';
import { validate } from '../services/validate.service.js';
import { updateUserSchema } from '../validators/userValidator.js';
import { getWishlist, toggleWishlist } from '../controllers/wishlist.controllers.js';
import { getAllApprovedProducts, searchProducts, filterProducts} from '../controllers/product.controllers.js';
import { createReview, updateReview, deleteReview } from "../controllers/review.controllers.js";
import { createComment, updateComment, deleteCommentUser } from "../controllers/comment.controllers.js";


const router = express.Router()

// Handling Profile
router.get("/profile", catchAsync(protectedRoute), catchAsync(getProfile))

router.put("/update", catchAsync(protectedRoute), validate(updateUserSchema), catchAsync(updateProfile))

// Handling Wishlist
router.get("/wishlist", catchAsync(protectedRoute), catchAsync(customerRoute), catchAsync(getWishlist))

router.post("/toggle-wishlist", catchAsync(protectedRoute), catchAsync(customerRoute), catchAsync(toggleWishlist))

// Get all products for user
router.get('/approved-products', catchAsync(getAllApprovedProducts));

// Handling Search and filter processes 
router.get('/search', catchAsync(searchProducts));
router.get('/filter', catchAsync(filterProducts));  

// Handling Reviews (Create, Update, Delete)
router.post("/create-review", catchAsync(protectedRoute), catchAsync(createReview));
router.put("/:reviewId", catchAsync(protectedRoute), catchAsync(updateReview));
router.delete("/:reviewId", catchAsync(protectedRoute), catchAsync(deleteReview));

// Handling Comments (Create, Update, Delete)
router.post("/review/:reviewId/comment", catchAsync(protectedRoute), catchAsync(createComment)); 
router.put("/comment/:commentId", catchAsync(protectedRoute), catchAsync(updateComment)); 
router.delete("/comment/:commentId", catchAsync(protectedRoute), catchAsync(deleteCommentUser)); 

export default router;