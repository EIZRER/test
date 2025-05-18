import express from 'express';
import { Event } from '../models/Event';

const router = express.Router();

// Create a new event
router.post('/', async (req, res) => {
  try {
    const event = new Event(req.body);
    const savedEvent = await event.save();
    res.status(201).json(savedEvent);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// Get all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router; 