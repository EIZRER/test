import axios from 'axios';
import { Event, EventCategory } from '../types/event';

const API_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

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
export const getEvents = () => 
  api.get('/events');

export const getUserEvents = (userId: string) =>
  api.get(`/events/user/${userId}`);

export const createEvent = (data: FormData) =>
  api.post('/events', data, {
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

export const fetchEvents = async (category?: EventCategory): Promise<Event[]> => {
  const url = category && category !== 'Бүгд'
    ? `${API_URL}/events?category=${encodeURIComponent(category)}`
    : `${API_URL}/events`;
    
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error('Failed to fetch events');
  }
  
  return response.json();
};

export const fetchEventById = async (id: string): Promise<Event> => {
  const response = await fetch(`${API_URL}/events/${id}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch event');
  }
  
  return response.json();
}; 