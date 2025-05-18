import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { Event } from '../models/Event';
import fs from 'fs';
import path from 'path';

// Get all events with optional filtering
export const getEvents = asyncHandler(async (req: Request, res: Response) => {
  const { category } = req.query;
  
  const filter = category && category !== 'Бүгд' 
    ? { category } 
    : {};
  
  const events = await Event.find(filter).populate('organizer', 'username firstName lastName');
  res.json(events);
});

// Get events created by a specific user
export const getUserEvents = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;

  const events = await Event.find({ organizer: userId });

  if (!events.length) {
    res.status(200).json([]); // ✅ don't return it
    return; // ✅ this is fine — it exits the function
  }

  res.json(events);
});


// Get a single event by ID
export const getEventById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  const event = await Event.findById(id).populate('organizer', 'username firstName lastName');
  
  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }
  
  res.json(event);
});

// Create a new event
export const createEvent = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    res.status(401);
    throw new Error('Not authorized');
  }
  
  // Create uploads directory if it doesn't exist
  const uploadsDir = path.join(__dirname, '../../uploads/events');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  
  let imageUrl = '';
  
  if (req.file) {
    // Generate unique filename
    const fileExt = path.extname(req.file.originalname);
    const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${fileExt}`;
    const filePath = path.join(uploadsDir, fileName);
    
    // Save the file
    fs.writeFileSync(filePath, req.file.buffer);
    
    // Set the image URL
    imageUrl = `/uploads/events/${fileName}`;
  } else {
    res.status(400);
    throw new Error('Image is required');
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
  
  res.status(201).json(event);
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
    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(__dirname, '../../uploads/events');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    
    // Generate unique filename
    const fileExt = path.extname(req.file.originalname);
    const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${fileExt}`;
    const filePath = path.join(uploadsDir, fileName);
    
    // Save the file
    fs.writeFileSync(filePath, req.file.buffer);
    
    // Delete old image if it exists and is not the default
    if (event.imageUrl && !event.imageUrl.includes('placeholder') && fs.existsSync(path.join(__dirname, '../..', event.imageUrl))) {
      fs.unlinkSync(path.join(__dirname, '../..', event.imageUrl));
    }
    
    // Set the new image URL
    imageUrl = `/uploads/events/${fileName}`;
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
  
  res.json(updatedEvent);
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
  
  // Delete the image file if it exists and is not a placeholder
  if (event.imageUrl && !event.imageUrl.includes('placeholder') && fs.existsSync(path.join(__dirname, '../..', event.imageUrl))) {
    fs.unlinkSync(path.join(__dirname, '../..', event.imageUrl));
  }
  
  await Event.findByIdAndDelete(id);
  
  res.json({ message: 'Event removed' });
});
