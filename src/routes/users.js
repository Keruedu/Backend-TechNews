import express from 'express';
import { 
  getUsers, 
  getUserById, 
  updateUser, 
  deleteUser, 
  toggleFollow,
  getAllUsers,
  toggleBanUser 
} from '../controllers/userController.js';
import { uploadImage } from '../controllers/uploadController.js';
import upload from '../config/cloudinary-config.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get("/manage", authMiddleware, getAllUsers);

router.get("/", getUsers);
router.get("/:id", getUserById);
router.put("/:id", authMiddleware, updateUser);
router.delete("/:id", authMiddleware, deleteUser);
router.post("/:id/follow", authMiddleware, toggleFollow);

// Route for uploading images
router.post("/upload", authMiddleware, upload.single('upload'), uploadImage);

router.patch("/:id/ban", authMiddleware, toggleBanUser);

export default router;