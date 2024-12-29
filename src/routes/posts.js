import express from 'express';
import { createPost, deletePost, getPosts, updatePost, getPostComments } from '../controllers/postController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get("/", getPosts);
router.post("/", authMiddleware, createPost);
router.put("/:id", authMiddleware, updatePost);
router.delete("/:id", authMiddleware, deletePost);
router.get("/:id/comments", getPostComments); // Thêm route này


export default router;