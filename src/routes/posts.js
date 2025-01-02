import express from 'express';
import { createPost, deletePost, getPosts, updatePost, searchPosts, getPostComments } from '../controllers/postController.js';
import { uploadImage } from '../controllers/uploadController.js';
import upload from '../services/multerService.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post("/search", searchPosts); // New route for searching posts with filters and sorting
router.get("/", getPosts);

router.post("/uploads", upload, uploadImage); // New route for image uploads

router.post("/", authMiddleware, createPost);
router.put("/:id", authMiddleware, updatePost);
router.delete("/:id", authMiddleware, deletePost);
router.get("/:id/comments", getPostComments); // Thêm route này


export default router;