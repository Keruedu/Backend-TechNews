//users.js
import express from 'express';
import { 
  getUsers, 
  getUserById, 
  updateUser, 
  deleteUser, 
  toggleFollow,
  toggleBanUser,
  toggleRole 
} from '../controllers/userController.js';
import { uploadImage } from '../controllers/uploadController.js';
import upload from '../config/cloudinary-config.js';
import { authMiddleware, adminOrManagerMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Route admin cần cả authMiddleware và adminOrManagerMiddleware
router.get("/manage-accounts", authMiddleware, adminOrManagerMiddleware, getUsers);

// Các route khác giữ nguyên
router.post("/upload", authMiddleware, upload.single('upload'), uploadImage);
router.patch("/:id/toggle-ban", authMiddleware, adminOrManagerMiddleware, toggleBanUser);
router.get("/:id", getUserById);
router.put("/:id", authMiddleware, updateUser);
router.delete("/:id", authMiddleware, deleteUser);
router.post("/:id/follow", authMiddleware, toggleFollow);
router.patch("/:id/toggle-role", authMiddleware, adminOrManagerMiddleware, toggleRole);

export default router;