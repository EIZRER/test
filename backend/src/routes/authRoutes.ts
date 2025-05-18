import express from 'express';
import { register, login, logout, getUserProfile } from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/profile', protect, getUserProfile);

export default router; 