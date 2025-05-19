import { Event } from '../types/event';

export const mockEvents: Event[] = [
  {
    _id: '1',
    id: '1',
    title: 'Гэгээн Муза 18" Шагнал гардуулах ёслол',
    description: 'Энэхүү арга хэмжээ нь Монголын урлагийн салбарын шилдэгүүдийг шалгаруулах ёслол юм.',
    date: '2025-05-24',
    venue: 'The Corporate Convention Centre',
    price: 88000,
    imageUrl: 'https://img.freepik.com/free-vector/modern-music-event-poster-template_1361-1292.jpg',
    category: 'Урлаг',
    location: {
      latitude: 47.9138,
      longitude: 106.9172,
      address: 'The Corporate Convention Centre, Ulaanbaatar'
    }
  },
  {
    _id: '2',
    id: '2',
    title: 'КАСЕТА-GANGBAY',
    description: 'Хип хоп, рэп урсгалын шилдэг уран бүтээлчдийн тоглолт.',
    date: '2025-05-24',
    venue: 'Ундэсний Тев Цэнгэлдэх Хурээлэн',
    price: 69000,
    imageUrl: 'https://static.vecteezy.com/system/resources/thumbnails/041/388/388/small/ai-generated-concert-crowd-enjoying-live-music-event-photo.jpg',
    category: 'Фестиваль',
    location: {
      latitude: 47.9185,
      longitude: 106.9056,
      address: 'Ундэсний Тев Цэнгэлдэх Хурээлэн, Ulaanbaatar'
    }
  },
  {
    _id: '3',
    id: '3',
    title: 'GUYS СУРГУУЛЬ МИНЬ БАЯРТАЙ',
    description: 'Төгсөлтийн тоглолт - сургуулийн төгсөлтийг тэмдэглэх арга хэмжээ.',
    date: '2025-05-31',
    venue: 'Socialpay Park',
    price: 78000,
    imageUrl: 'https://img.freepik.com/free-vector/music-event-poster-template-with-abstract-shapes_1361-1316.jpg?semt=ais_hybrid&w=740',
    category: 'Шоу тоглолт',
    location: {
      latitude: 47.9220,
      longitude: 106.9190,
      address: 'Socialpay Park, Ulaanbaatar'
    }
  },
  {
    _id: '4',
    id: '4',
    title: 'CAMERTON 30',
    description: 'Camerton хамтлагийн 30 жилийн ойн тоглолт.',
    date: '2025-06-28',
    venue: 'Socialpay Park',
    price: 108000,
    imageUrl: 'https://via.placeholder.com/300x200?text=Camerton',
    category: 'Урлаг',
    location: {
      latitude: 47.9220,
      longitude: 106.9190,
      address: 'Socialpay Park, Ulaanbaatar'
    }
  },
]; 