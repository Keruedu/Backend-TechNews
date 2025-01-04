import express from 'express';
import { signup, signin, forgotPassword, resetPassword, checkToken } from '../controllers/authController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword); 
router.get("/check-token", authMiddleware, checkToken);

export default router;