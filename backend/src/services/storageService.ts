import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

/**
 * Service for handling file storage operations
 */
class StorageService {
  private uploadsDir: string;

  constructor() {
    // Set uploads directory path
    this.uploadsDir = path.join(__dirname, '../../uploads');
    this.ensureUploadsDir();
  }

  /**
   * Ensure uploads directory exists
   */
  private ensureUploadsDir(): void {
    if (!fs.existsSync(this.uploadsDir)) {
      fs.mkdirSync(this.uploadsDir, { recursive: true });
    }
    
    // Create subdirectories if they don't exist
    const subdirs = ['avatars', 'covers', 'events'];
    subdirs.forEach(dir => {
      const subDirPath = path.join(this.uploadsDir, dir);
      if (!fs.existsSync(subDirPath)) {
        fs.mkdirSync(subDirPath, { recursive: true });
      }
    });
  }

  /**
   * Upload a file to storage
   * @param file File object from multer
   * @param subDir Optional subdirectory
   * @returns URL of the uploaded file
   */
  async uploadFile(file: Express.Multer.File, subDir: string = 'events'): Promise<string> {
    this.ensureUploadsDir();
    
    // Generate unique filename
    const fileExt = path.extname(file.originalname);
    const fileName = `${uuidv4()}${fileExt}`;
    
    // Determine target directory
    const targetDir = path.join(this.uploadsDir, subDir);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    
    // Set file path
    const filePath = path.join(targetDir, fileName);
    
    // Write file
    fs.writeFileSync(filePath, file.buffer);
    
    // Return public URL
    return `/uploads/${subDir}/${fileName}`;
  }

  /**
   * Delete a file from storage
   * @param fileUrl URL of the file to delete
   * @returns True if successful
   */
  async deleteFile(fileUrl: string): Promise<boolean> {
    try {
      // Skip if URL is external
      if (fileUrl.startsWith('http')) {
        return true;
      }
      
      // Remove leading slash if it exists
      const relativePath = fileUrl.startsWith('/') ? fileUrl.substring(1) : fileUrl;
      const filePath = path.join(__dirname, '../..', relativePath);
      
      // Check if file exists
      if (!fs.existsSync(filePath)) {
        return false;
      }
      
      // Delete file
      fs.unlinkSync(filePath);
      return true;
    } catch (error) {
      console.error('Error deleting file:', error);
      return false;
    }
  }
}

export const storageService = new StorageService(); 