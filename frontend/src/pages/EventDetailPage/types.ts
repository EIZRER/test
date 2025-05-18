export interface Event {
  _id: string;
  id?: string; // For backward compatibility
  title: string;
  description: string;
  date: string;
  time?: string;
  venue?: string;
  price?: number;
  imageUrl?: string;
  category: string;
  status?: 'active' | 'completed' | 'canceled';
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  organizer?: {
    _id: string;
    name: string;
    avatarUrl?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}
