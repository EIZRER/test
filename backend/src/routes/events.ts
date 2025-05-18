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

// Get all events (with optional category filter)
router.get('/', async (req, res) => {
  try {
    const category = req.query.category as string;
    let events;

    if (category && category !== 'Бүгд') {
      events = await Event.find({ category });
    } else {
      events = await Event.find();
    }

    res.json(events);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Get event by ID
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
