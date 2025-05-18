export interface Event {
  _id: string;
  id?: string; // For backward compatibility
  title: string;
  description: string;
  date: string;
  time?: string;
  venue?: string;
  price: number;
  imageUrl: string;
  category: EventCategory;
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  organizer?: any; // Reference to user
  createdAt?: string;
  updatedAt?: string;
}

export type EventCategory =
  | 'Бүгд'
  | 'Фестиваль'
  | 'Урлаг'
  | 'Сайн дурын ажиллагаа'
  | 'Боловсрол'
  | 'Тэмдэглэлт өдөр'
  | 'Бизнес эвэнт'
  | 'Шинжлэх ухаан'
  | 'Шоу тоглолт'
  | 'Амралт зуг';

export interface CategoryFilter {
  id: string;
  label: EventCategory;
  icon: string;
} 