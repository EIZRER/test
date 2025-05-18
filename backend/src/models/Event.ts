import mongoose, { Document, Schema } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  description: string;
  date: Date;
  category: string;
  price: number;
  imageUrl: string;
  location: string;
  organizer: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const eventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    imageUrl: { type: String, required: true },
    location: { type: String, required: true },
    organizer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export const Event = mongoose.model<IEvent>('Event', eventSchema); 