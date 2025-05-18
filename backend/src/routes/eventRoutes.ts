import express from 'express';
import multer from 'multer';
import { getEvents, getUserEvents, createEvent, updateEvent } from '../controllers/eventController';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/', getEvents);
router.get('/user/:userId', getUserEvents);
router.post('/', upload.single('image'), createEvent);
router.put('/:eventId', upload.single('image'), updateEvent);

export default router; 