import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { User } from '../models/User';
import { storageService } from '../services/storageService';

export const getUserProfile = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const user = await User.findById(userId);
  
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  
  res.json(user);
});

export const updateUserProfile = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const { firstName, lastName, email, phone, about } = req.body;
  
  const user = await User.findById(userId);
  
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  
  user.firstName = firstName || user.firstName;
  user.lastName = lastName || user.lastName;
  user.email = email || user.email;
  user.phone = phone || user.phone;
  user.about = about || user.about;
  
  const updatedUser = await user.save();
  res.json(updatedUser);
});

export const uploadProfileImage = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const imageType = req.query.type as 'avatar' | 'cover';
  
  if (!req.file) {
    res.status(400);
    throw new Error('No file uploaded');
  }
  
  const user = await User.findById(userId);
  
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  
  // Upload new image
  const imageUrl = await storageService.uploadFile(req.file);
  
  // Delete old image if exists
  if (imageType === 'avatar' && user.avatarUrl) {
    await storageService.deleteFile(user.avatarUrl);
  } else if (imageType === 'cover' && user.coverImageUrl) {
    await storageService.deleteFile(user.coverImageUrl);
  }
  
  // Update user with new image URL
  if (imageType === 'avatar') {
    user.avatarUrl = imageUrl;
  } else {
    user.coverImageUrl = imageUrl;
  }
  
  const updatedUser = await user.save();
  res.json(updatedUser);
}); 