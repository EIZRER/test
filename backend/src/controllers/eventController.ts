import { RequestHandler } from 'express';
import { Event } from '../models/Event';


// GET all events
export const getEvents: RequestHandler = async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching events' });
  }
};

// GET event by ID
export const getEventById: RequestHandler = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      res.status(404).json({ message: 'Event not found' });
    } else {
      res.status(200).json(event);
    }
  } catch (err) {
    res.status(500).json({ message: 'Error fetching event' });
  }
};

// POST create event
export const createEvent: RequestHandler = async (req, res) => {
  try {
    const newEvent = new Event(req.body);
    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (err) {
    res.status(400).json({ message: 'Error creating event' });
  }
};

// PUT update event
export const updateEvent: RequestHandler = async (req, res) => {
  try {
    const updated = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      res.status(404).json({ message: 'Event not found' });
    } else {
      res.status(200).json(updated);
    }
  } catch (err) {
    res.status(400).json({ message: 'Error updating event' });
  }
};

// DELETE event
export const deleteEvent: RequestHandler = async (req, res) => {
  try {
    const deleted = await Event.findByIdAndDelete(req.params.id);
    if (!deleted) {
      res.status(404).json({ message: 'Event not found' });
    } else {
      res.status(204).end();
    }
  } catch (err) {
    res.status(500).json({ message: 'Error deleting event' });
  }
};
