import mongoose, { Document, Schema } from 'mongoose';

interface ILocation {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface IEvent extends Document {
  title: string;
  description: string;
  date: Date;
  time?: string;
  category: string;
  price: number;
  imageUrl: string;
  location: ILocation;
  venue?: string;
  organizer: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const locationSchema = new Schema<ILocation>({
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  address: { type: String }
});

const eventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String },
    category: { type: String, required: true },
    price: { type: Number, required: true, default: 0 },
    imageUrl: { type: String, required: true },
    location: { type: locationSchema, required: true },
    venue: { type: String },
    organizer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export const Event = mongoose.model<IEvent>('Event', eventSchema);
