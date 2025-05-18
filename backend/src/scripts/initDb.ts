import mongoose from 'mongoose';
import { User } from '../models/User';
import { Event } from '../models/Event';
import { config } from '../config';

// Connect to MongoDB
const initDb = async () => {
  try {
    await mongoose.connect(config.mongoUri);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Event.deleteMany({});

    // Create admin user
    const admin = await User.create({
      username: 'admin',
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@example.com',
      phone: '99119911',
      password: 'password123',
      isAdmin: true,
    });

    // Create regular user
    const user = await User.create({
      username: 'user',
      firstName: 'Regular',
      lastName: 'User',
      email: 'user@example.com',
      phone: '88118811',
      password: 'password123',
    });

    // Create sample events
    const events = [
      {
        title: 'Music Festival',
        description: 'A great music event with various artists',
        date: new Date('2023-08-15'),
        category: 'Music',
        price: 50000,
        imageUrl: 'https://via.placeholder.com/800x400?text=Music+Festival',
        location: 'Central Stadium, Ulaanbaatar',
        organizer: admin._id,
      },
      {
        title: 'Tech Conference',
        description: 'Learn about the latest technology trends',
        date: new Date('2023-09-20'),
        category: 'Technology',
        price: 75000,
        imageUrl: 'https://via.placeholder.com/800x400?text=Tech+Conference',
        location: 'IT Park, Ulaanbaatar',
        organizer: admin._id,
      },
      {
        title: 'Art Exhibition',
        description: 'Showcasing local and international artists',
        date: new Date('2023-10-05'),
        category: 'Art',
        price: 25000,
        imageUrl: 'https://via.placeholder.com/800x400?text=Art+Exhibition',
        location: 'Modern Art Gallery, Ulaanbaatar',
        organizer: user._id,
      },
    ];

    await Event.insertMany(events);

    console.log('Sample data created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
};

initDb(); 