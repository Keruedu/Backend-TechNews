import express from 'express';
import { signup, signin, checkToken  } from '../controllers/authController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/check-token", authMiddleware, checkToken);

export default router;