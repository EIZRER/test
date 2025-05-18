import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configure multer storage
const storage = multer.memoryStorage();

// Create upload directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  
  // Create subdirectories
  const subdirs = ['avatars', 'covers', 'events'];
  subdirs.forEach(dir => {
    const subDir = path.join(uploadsDir, dir);
    if (!fs.existsSync(subDir)) {
      fs.mkdirSync(subDir, { recursive: true });
    }
  });
}

// Configure upload options
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
  },
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.') as any, false);
    }
  },
});

/**
 * Middleware for handling single file uploads
 * @param fieldName The name of the field to upload
 */
export const uploadFile = (fieldName: string = 'image') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const singleUpload = upload.single(fieldName);

    singleUpload(req, res, (err: any) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: 'File is too large. Maximum size is 10MB.' });
          }
        }
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  };
};

/**
 * Middleware for handling multiple file uploads
 * @param fieldName The name of the field to upload
 * @param maxCount Maximum number of files to upload
 */
export const uploadFiles = (fieldName: string = 'images', maxCount: number = 5) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const multiUpload = upload.array(fieldName, maxCount);

    multiUpload(req, res, (err: any) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: 'File is too large. Maximum size is 10MB.' });
          }
          if (err.code === 'LIMIT_UNEXPECTED_FILE') {
            return res.status(400).json({ message: `Too many files. Maximum is ${maxCount}.` });
          }
        }
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  };
}; 