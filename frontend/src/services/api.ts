import axios from 'axios';
import { Event, EventCategory } from '../types/event';

// Base API configuration
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const BASE_URL = API_URL.replace('/api', '');

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Helper function to convert relative image paths to absolute URLs
export const getImageUrl = (imagePath: string | undefined): string => {
  if (!imagePath) return 'https://via.placeholder.com/300x200?text=No+Image';
  if (imagePath.startsWith('http')) return imagePath;
  
  // Ensure the path is properly formatted relative to the BASE_URL
  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${BASE_URL}${cleanPath}`;
};

// Error handling interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Auth API
export const register = (data: {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}) => api.post('/auth/register', data);

export const login = (data: { phone: string; password: string }) =>
  api.post('/auth/login', data);

export const logout = () => api.post('/auth/logout');

export const getCurrentUser = () => api.get('/auth/profile');

// User API
export const getUserProfile = (userId: string) => 
  api.get(`/users/${userId}`);

export const updateUserProfile = (userId: string, data: any) =>
  api.put(`/users/${userId}`, data);

export const uploadUserImage = (userId: string, file: File, type: 'avatar' | 'cover') => {
  const formData = new FormData();
  formData.append('image', file);
  return api.post(`/users/${userId}/upload?type=${type}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// Event API
export const getEvents = (category?: string) => {
  const url = category && category !== 'Бүгд'
    ? `/events?category=${encodeURIComponent(category)}`
    : '/events';
  
  return api.get(url);
};

export const getUserEvents = (userId: string) =>
  api.get(`/events/user/${userId}`);

export const getEventById = (eventId: string) => 
  api.get(`/events/${eventId}`);

export const createEvent = (eventData: FormData) =>
  api.post('/events', eventData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

export const updateEvent = (eventId: string, data: FormData) =>
  api.put(`/events/${eventId}`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

export const deleteEvent = (eventId: string) =>
  api.delete(`/events/${eventId}`);

// Simplified fetch methods for compatibility
export const fetchEvents = async (category?: EventCategory): Promise<Event[]> => {
  try {
    const response = await getEvents(category);
    return response.data;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw new Error('Failed to fetch events');
  }
};

export const fetchEventById = async (id: string): Promise<Event> => {
  try {
    const response = await getEventById(id);
    return response.data;
  } catch (error) {
    console.error('Error fetching event details:', error);
    throw new Error('Failed to fetch event');
  }
}; 