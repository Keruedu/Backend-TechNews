import express from 'express';
import { getUsers, getUserById, updateUser, deleteUser } from '../controllers/userController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get("/", getUsers);
router.get("/:id", getUserById);
router.put("/:id", authMiddleware, updateUser);
router.delete("/:id", authMiddleware, deleteUser);

export default router;