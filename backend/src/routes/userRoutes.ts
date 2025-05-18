import express from 'express';
import multer from 'multer';
import { getUserProfile, updateUserProfile, uploadProfileImage } from '../controllers/userController';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/:userId', getUserProfile);
router.put('/:userId', updateUserProfile);
router.post('/:userId/upload', upload.single('image'), uploadProfileImage);

export default router; 