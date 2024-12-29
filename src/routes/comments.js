import express from 'express';
import { getComments, createComment, updateComment, deleteComment } from '../controllers/commentController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get("/", getComments);
router.post("/", authMiddleware, createComment);
router.put("/:id", authMiddleware, updateComment);
router.delete("/:id", authMiddleware, deleteComment);

export default router;