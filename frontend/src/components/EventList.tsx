import React, { useState, useRef } from 'react';
import { Event, EventCategory } from '../types/event';
import { EventCard } from './EventCard';
import { CategoryFilter } from './CategoryFilter';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Button, Space } from 'antd';
import { mockEvents } from '../mock/events';

const categories = [
  { id: '1', label: 'Бүгд' as EventCategory, icon: '🎪' },
  { id: '2', label: 'Фестиваль' as EventCategory, icon: '🎵' },
  { id: '3', label: 'Урлаг' as EventCategory, icon: '🎨' },
  { id: '4', label: 'Сайн дурын ажиллагаа' as EventCategory, icon: '🤝' },
  { id: '5', label: 'Боловсрол' as EventCategory, icon: '📚' },
  { id: '6', label: 'Тэмдэглэлт өдөр' as EventCategory, icon: '🎉' },
  { id: '7', label: 'Бизнес эвэнт' as EventCategory, icon: '💼' },
  { id: '8', label: 'Шинжлэх ухаан' as EventCategory, icon: '🔬' },
  { id: '9', label: 'Шоу тоглолт' as EventCategory, icon: '🎭' },
  { id: '10', label: 'Амралт зуг' as EventCategory, icon: '🏖️' },
];

export const EventList: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<EventCategory>('Бүгд');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Filter events based on selected category
  const filteredEvents = selectedCategory === 'Бүгд'
    ? mockEvents
    : mockEvents.filter(event => event.category === selectedCategory);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = container.clientWidth * 0.8; // Scroll 80% of container width
      const newScrollLeft = container.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
      
      container.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  // Handle mouse wheel horizontal scrolling
  const handleWheel = (e: React.WheelEvent) => {
    if (scrollContainerRef.current && e.deltaY !== 0) {
      e.preventDefault();
      scrollContainerRef.current.scrollLeft += e.deltaY;
    }
  };

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <Button 
          icon={<LeftOutlined />}
          onClick={() => window.history.back()}
          type="text"
          className="text-gray-600 hover:text-gray-900"
        >
          Буцах
        </Button>
        <Space>
          <Button 
            icon={<LeftOutlined />}
            onClick={() => scroll('left')}
            shape="circle"
            className="flex items-center justify-center"
          />
          <Button 
            icon={<RightOutlined />}
            onClick={() => scroll('right')}
            shape="circle"
            className="flex items-center justify-center"
          />
        </Space>
      </div>

      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      <div 
        ref={scrollContainerRef}
        onWheel={handleWheel}
        className="mt-6 grid grid-flow-col auto-cols-[280px] gap-6 overflow-x-auto py-4 scrollbar-hide scroll-smooth touch-pan-x"
        style={{ 
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {filteredEvents.map((event) => (
          <div 
            key={event.id} 
            className="scroll-snap-align-start"
          >
            <EventCard event={event} />
          </div>
        ))}
      </div>
    </div>
  );
}; 