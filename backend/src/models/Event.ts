import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: String,
  imageUrl: String,
  location: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  organizer: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Event = mongoose.model('Event', eventSchema);
