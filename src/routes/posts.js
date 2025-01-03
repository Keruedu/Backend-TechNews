import express from 'express';
import { createPost, deletePost, getPosts, updatePost, searchPosts, getPostComments, getPostById, increaseViewCount, toggleUpvoteCount, toggleDownvoteCount } from '../controllers/postController.js';
import { uploadImage } from '../controllers/uploadController.js';
import upload from '../config/cloudinary-config.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post("/search", searchPosts); // New route for searching posts with filters and sorting
router.get("/", getPosts);
router.get("/:id", getPostById);

router.post("/uploads", upload.single('image'), uploadImage); // New route for image uploads

router.post("/", authMiddleware, createPost);
router.put("/:id", authMiddleware, updatePost);
router.delete("/:id", authMiddleware, deletePost);
router.get("/:id/comments", getPostComments); // Thêm route này

router.patch('/:id/view', increaseViewCount);
router.patch('/:id/upvote', authMiddleware, toggleUpvoteCount);
router.patch('/:id/downvote', authMiddleware, toggleDownvoteCount);

export default router;