//users.js
import express from 'express';
import { 
  getUsers, 
  getUserById, 
  updateUser, 
  deleteUser, 
  toggleFollow,
  toggleBanUser,
  toggleRole,
  getStatistics,
  getRegistrationStats,
  getPostStats
} from '../controllers/userController.js';
import { uploadImage } from '../controllers/uploadController.js';
import upload from '../config/cloudinary-config.js';
import { authMiddleware, adminOrManagerMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Đặt các route cụ thể trước
router.get("/statistics", authMiddleware, adminOrManagerMiddleware, getStatistics);
router.get("/statistics/registrations", authMiddleware, adminOrManagerMiddleware, getRegistrationStats);
router.get('/statistics/posts', authMiddleware, adminOrManagerMiddleware, getPostStats);
router.get("/manage-accounts", authMiddleware, adminOrManagerMiddleware, getUsers);

// Các route với params đặt sau
router.get("/:id", getUserById);
router.put("/:id", authMiddleware, updateUser);
router.delete("/:id", authMiddleware, deleteUser);
router.post("/:id/follow", authMiddleware, toggleFollow);
router.patch("/:id/toggle-ban", authMiddleware, adminOrManagerMiddleware, toggleBanUser);
router.patch("/:id/toggle-role", authMiddleware, adminOrManagerMiddleware, toggleRole);

// Các route khác giữ nguyên
router.post("/upload", authMiddleware, upload.single('upload'), uploadImage);

export default router;