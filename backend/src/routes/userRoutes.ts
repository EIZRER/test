import express from 'express';
import { getUserProfile, updateUserProfile, uploadProfileImage } from '../controllers/userController';
import { uploadFile } from '../middleware/uploadMiddleware';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// Get user profile
router.get('/:userId', getUserProfile);

// Update user profile
router.put('/:userId', protect, updateUserProfile);

// Upload profile image (avatar or cover)
router.post('/:userId/upload', protect, uploadFile('image'), uploadProfileImage);

export default router; 