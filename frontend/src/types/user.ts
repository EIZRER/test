export interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  about?: string;
  avatarUrl?: string;
  coverImageUrl?: string;
  username: string;
  isAdmin?: boolean;
  createdAt: string;
  updatedAt: string;
} 