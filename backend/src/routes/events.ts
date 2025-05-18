import express from 'express';
import { Event } from '../types/event';

const router = express.Router();

// Sample events data (in a real app, this would come from a database)
const events: Event[] = [
  {
    id: '1',
    title: 'Гэгээн Муза 18" Шагнал гардуулах ёслол',
    date: '2025-05-24',
    venue: 'The Corporate Convention Centre',
    price: 88000,
    imageUrl: '/images/events/saint-muse.jpg',
    category: 'Урлаг',
  },
  {
    id: '2',
    title: 'КАСЕТА-GANGBAY',
    date: '2025-05-24',
    venue: 'Ундэсний Тев Цэнгэлдэх Хурээлэн',
    price: 69000,
    imageUrl: '/images/events/kaseta.jpg',
    category: 'Фестиваль',
  },
  {
    id: '3',
    title: 'GUYS СУРГУУЛЬ МИНЬ БАЯРТАЙ',
    date: '2025-05-31',
    venue: 'Socialpay Park',
    price: 78000,
    imageUrl: '/images/events/guys.jpg',
    category: 'Шоу тоглолт',
  },
  {
    id: '4',
    title: 'CAMERTON 30',
    date: '2025-06-28',
    venue: 'Socialpay Park',
    price: 108000,
    imageUrl: '/images/events/camerton.jpg',
    category: 'Урлаг',
  },
  {
    id: '5',
    title: 'CAMERTON 30',
    date: '2025-06-28',
    venue: 'Socialpay Park',
    price: 108000,
    imageUrl: '/images/events/camerton.jpg',
    category: 'Урлаг',
  },
  {
    id: '6',
    title: 'CAMERTON 30',
    date: '2025-06-28',
    venue: 'Socialpay Park',
    price: 108000,
    imageUrl: '/images/events/camerton.jpg',
    category: 'Урлаг',
  },
  {
    id: '7',
    title: 'CAMERTON 30',
    date: '2025-06-28',
    venue: 'Socialpay Park',
    price: 108000,
    imageUrl: '/images/events/camerton.jpg',
    category: 'Урлаг',
  },
];

// GET /api/events
router.get('/', (req, res) => {
  const category = req.query.category as string;
  
  if (category && category !== 'Бүгд') {
    const filteredEvents = events.filter(event => event.category === category);
    res.json(filteredEvents);
  } else {
    res.json(events);
  }
});

// GET /api/events/:id
router.get('/:id', (req, res) => {
  const event = events.find(e => e.id === req.params.id);
  
  if (event) {
    res.json(event);
  } else {
    res.status(404).json({ message: 'Event not found' });
  }
});

export default router; 