import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/live_event_map',
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  sakura: {
    accessKey: process.env.SAKURA_ACCESS_KEY || '',
    secretKey: process.env.SAKURA_SECRET_KEY || '',
    endpoint: process.env.SAKURA_ENDPOINT || '',
    bucketName: process.env.SAKURA_BUCKET_NAME || '',
    cdnEndpoint: process.env.SAKURA_CDN_ENDPOINT || '',
  },
}; 