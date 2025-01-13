import express from 'express';
import { createNotification, getNotifications } from '../controllers/notificationController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, createNotification);
router.get('/:userId', authMiddleware, getNotifications);

export default router;