import { ObjectStorage } from '@sakuracloud/object-storage';
import { config } from '../config';

class StorageService {
  private storage: ObjectStorage;
  private bucketName: string;

  constructor() {
    this.storage = new ObjectStorage({
      accessKey: config.sakura.accessKey,
      secretKey: config.sakura.secretKey,
      endpoint: config.sakura.endpoint,
    });
    this.bucketName = config.sakura.bucketName;
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const fileName = `${Date.now()}-${file.originalname}`;
    
    await this.storage.putObject({
      Bucket: this.bucketName,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    return `${config.sakura.cdnEndpoint}/${this.bucketName}/${fileName}`;
  }

  async deleteFile(fileUrl: string): Promise<void> {
    const fileName = fileUrl.split('/').pop();
    if (!fileName) return;

    await this.storage.deleteObject({
      Bucket: this.bucketName,
      Key: fileName,
    });
  }
}

export const storageService = new StorageService(); 