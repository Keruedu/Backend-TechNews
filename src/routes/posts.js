import express from 'express';
import { createPost, deletePost, deleteMultiplePosts, getPosts, updatePost, searchPosts, getPostComments, getPostById, increaseViewCount, toggleUpvoteCount, toggleDownvoteCount, toggleBookmark, updatePostStatus } from '../controllers/postController.js';
import { uploadImage } from '../controllers/uploadController.js';
import upload from '../config/cloudinary-config.js';
import { authMiddleware, adminOrManagerMiddleware, authorOrAdminOrManagerMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post("/search", searchPosts); // New route for searching posts with filters and sorting
router.get("/", getPosts);
router.get("/:id", getPostById);

router.post("/uploads", upload.single('image'), uploadImage); // New route for image uploads

router.post("/", authMiddleware, createPost);
router.put("/:id", authMiddleware, authorOrAdminOrManagerMiddleware, updatePost); // Use the new middleware here
router.delete("/:id", authMiddleware, deletePost);
router.delete("/", authMiddleware, deleteMultiplePosts); // Route for deleting multiple posts
router.get("/:id/comments", getPostComments);

router.patch('/:id/view', increaseViewCount);
router.patch('/:id/upvote', authMiddleware, toggleUpvoteCount);
router.patch('/:id/downvote', authMiddleware, toggleDownvoteCount);
router.patch('/:id/bookmark', authMiddleware, toggleBookmark);

// New route for updating post status, protected by adminOrManagerMiddleware
router.patch('/:id/status', authMiddleware, adminOrManagerMiddleware, updatePostStatus);

export default router;