import express from 'express';
import { getUsers, getUserById, updateUser, deleteUser, toggleFollow } from '../controllers/userController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get("/", getUsers);
router.get("/:id", getUserById);
router.put("/:id", authMiddleware, updateUser);
router.delete("/:id", authMiddleware, deleteUser);
router.post("/:id/follow", authMiddleware, toggleFollow);

export default router;