import express from 'express';
import {
  getEvents,
  getUserEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} from '../controllers/eventController';
import { uploadFile } from '../middleware/uploadMiddleware';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// Public routes
router.get('/', getEvents);
router.get('/user/:userId', getUserEvents);
router.get('/:id', getEventById);

// Protected routes (require authentication)
router.post('/', protect, uploadFile('image'), createEvent);
router.put('/:eventId', protect, uploadFile('image'), updateEvent);
router.delete('/:id', protect, deleteEvent);

export default router;
