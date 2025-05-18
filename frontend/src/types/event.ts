export interface Event {
  id: string;
  title: string;
  date: string;
  venue: string;
  price: number;
  imageUrl: string;
  category: EventCategory;
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