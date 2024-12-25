import express from 'express';
import { createPost, deletePost, getPosts, updatePost, searchPosts } from '../controllers/postController.js';

const router = express.Router();

router.post("/search", searchPosts); // New route for searching posts with filters and sorting
router.get("/", getPosts);
router.post("/", createPost);
router.put("/:id", updatePost);
router.delete("/:id", deletePost);

export default router;
