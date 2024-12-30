import express from 'express';
import { getTags, createTag, updateTag, deleteTag } from '../controllers/tagController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get("/", getTags);
router.post("/", authMiddleware, createTag);
router.put("/:id", authMiddleware, updateTag);
router.delete("/:id", authMiddleware, deleteTag);

export default router;