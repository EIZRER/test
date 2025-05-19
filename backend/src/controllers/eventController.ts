import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { Event } from '../models/Event';
import fs from 'fs';
import path from 'path';
import { storageService } from '../services/storageService';

// Get all events with optional filtering
export const getEvents = asyncHandler(async (req: Request, res: Response) => {
  const { category } = req.query;
  
  const filter = category && category !== 'Бүгд' 
    ? { category } 
    : {};
  
  const events = await Event.find(filter).populate('organizer', 'username firstName lastName');
  
  // Convert image paths to full URLs
  const eventsWithUrls = events.map(event => {
    const eventObj = event.toObject();
    if (eventObj.imageUrl) {
      eventObj.imageUrl = storageService.getFullUrl(eventObj.imageUrl);
    }
    return eventObj;
  });
  
  res.json(eventsWithUrls);
});

// Get events created by a specific user
export const getUserEvents = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;

  const events = await Event.find({ organizer: userId });

  if (!events.length) {
    res.status(200).json([]); 
    return;
  }

  // Convert image paths to full URLs
  const eventsWithUrls = events.map(event => {
    const eventObj = event.toObject();
    if (eventObj.imageUrl) {
      eventObj.imageUrl = storageService.getFullUrl(eventObj.imageUrl);
    }
    return eventObj;
  });

  res.json(eventsWithUrls);
});

// Get a single event by ID
export const getEventById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  const event = await Event.findById(id).populate('organizer', 'username firstName lastName');
  
  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }
  
  // Convert image path to full URL
  const eventObj = event.toObject();
  if (eventObj.imageUrl) {
    eventObj.imageUrl = storageService.getFullUrl(eventObj.imageUrl);
  }
  
  res.json(eventObj);
});

// Create a new event
export const createEvent = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    res.status(401);
    throw new Error('Not authorized');
  }
  
  if (!req.file) {
    res.status(400);
    throw new Error('Image is required');
  }
  
  // Upload image using storage service
  const imageUrl = await storageService.uploadFile(req.file, 'events');
  
  const { 
    title, 
    description, 
    date, 
    time, 
    category, 
    price, 
    venue,
    location
  } = req.body;
  
  const eventData = {
    title,
    description,
    date: new Date(date),
    time,
    category,
    price: parseFloat(price) || 0,
    imageUrl,
    venue,
    location: {
      latitude: parseFloat(location.latitude) || 0,
      longitude: parseFloat(location.longitude) || 0,
      address: location.address || ''
    },
    organizer: req.user._id
  };
  
  const event = await Event.create(eventData);
  
  // Convert image path to full URL for response
  const eventObj = event.toObject();
  eventObj.imageUrl = storageService.getFullUrl(eventObj.imageUrl);
  
  res.status(201).json(eventObj);
});

// Update an event
export const updateEvent = asyncHandler(async (req: Request, res: Response) => {
  const { eventId } = req.params;
  
  if (!req.user) {
    res.status(401);
    throw new Error('Not authorized');
  }
  
  const event = await Event.findById(eventId);
  
  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }
  
  // Check if user is the organizer
  if (event.organizer.toString() !== req.user._id.toString() && !req.user.isAdmin) {
    res.status(403);
    throw new Error('Not authorized to update this event');
  }
  
  let imageUrl = event.imageUrl;
  
  if (req.file) {
    // Delete old image if it exists
    if (event.imageUrl) {
      await storageService.deleteFile(event.imageUrl);
    }
    
    // Upload new image
    imageUrl = await storageService.uploadFile(req.file, 'events');
  }
  
  const { 
    title, 
    description, 
    date, 
    time, 
    category, 
    price, 
    venue,
    location
  } = req.body;
  
  const eventData: any = {
    title,
    description,
    imageUrl,
    venue,
  };
  
  if (date) eventData.date = new Date(date);
  if (time) eventData.time = time;
  if (category) eventData.category = category;
  if (price) eventData.price = parseFloat(price);
  
  if (location) {
    eventData.location = {
      latitude: parseFloat(location.latitude) || event.location.latitude,
      longitude: parseFloat(location.longitude) || event.location.longitude,
      address: location.address || event.location.address || ''
    };
  }
  
  const updatedEvent = await Event.findByIdAndUpdate(
    eventId,
    eventData,
    { new: true }
  );
  
  // Convert image path to full URL for response
  const eventObj = updatedEvent!.toObject();
  eventObj.imageUrl = storageService.getFullUrl(eventObj.imageUrl);
  
  res.json(eventObj);
});

// Delete an event
export const deleteEvent = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  if (!req.user) {
    res.status(401);
    throw new Error('Not authorized');
  }
  
  const event = await Event.findById(id);
  
  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }
  
  // Check if user is the organizer or admin
  if (event.organizer.toString() !== req.user._id.toString() && !req.user.isAdmin) {
    res.status(403);
    throw new Error('Not authorized to delete this event');
  }
  
  // Delete the image file
  if (event.imageUrl) {
    await storageService.deleteFile(event.imageUrl);
  }
  
  await Event.findByIdAndDelete(id);
  
  res.json({ message: 'Event removed' });
});
