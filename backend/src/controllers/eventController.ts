import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { Event } from '../models/Event';
import { storageService } from '../services/storageService';

export const getEvents = asyncHandler(async (req: Request, res: Response) => {
  const events = await Event.find()
    .populate('organizer', 'firstName lastName')
    .sort({ date: 1 });
  res.json(events);
});

export const getUserEvents = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const events = await Event.find({ organizer: userId })
    .populate('organizer', 'firstName lastName')
    .sort({ date: 1 });
  res.json(events);
});

export const createEvent = asyncHandler(async (req: Request, res: Response) => {
  const { title, description, date, category, price, location, organizerId } = req.body;

  if (!req.file) {
    res.status(400);
    throw new Error('Event image is required');
  }

  const imageUrl = await storageService.uploadFile(req.file);

  const event = await Event.create({
    title,
    description,
    date,
    category,
    price,
    imageUrl,
    location,
    organizer: organizerId,
  });

  const populatedEvent = await event.populate('organizer', 'firstName lastName');
  res.status(201).json(populatedEvent);
});

export const updateEvent = asyncHandler(async (req: Request, res: Response) => {
  const eventId = req.params.eventId;
  const { title, description, date, category, price, location } = req.body;

  const event = await Event.findById(eventId);

  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  // Update image if provided
  if (req.file) {
    const newImageUrl = await storageService.uploadFile(req.file);
    await storageService.deleteFile(event.imageUrl);
    event.imageUrl = newImageUrl;
  }

  event.title = title || event.title;
  event.description = description || event.description;
  event.date = date || event.date;
  event.category = category || event.category;
  event.price = price || event.price;
  event.location = location || event.location;

  const updatedEvent = await event.save();
  const populatedEvent = await updatedEvent.populate('organizer', 'firstName lastName');
  res.json(populatedEvent);
}); 