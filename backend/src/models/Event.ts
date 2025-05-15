import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: String,
  time: String,
  imageUrl: String,
  location: {
    address: String,
  },
  category: String,
  organizer: String
});

export default mongoose.model('Event', eventSchema);
