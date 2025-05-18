import React, { useState, useRef, useEffect } from 'react';
import { Event, EventCategory } from '../types/event';
import { EventCard } from './EventCard';
import { CategoryFilter } from './CategoryFilter';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Button, Space, Spin } from 'antd';
import { fetchEvents } from '../services/api';

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

interface EventListProps {
  events?: Event[];
  loading?: boolean;
  onRefresh?: () => Promise<void>;
}

export const EventList: React.FC<EventListProps> = ({ 
  events: propEvents, 
  loading: propLoading,
  onRefresh
}) => {
  const [selectedCategory, setSelectedCategory] = useState<EventCategory>('Бүгд');
  const [events, setEvents] = useState<Event[]>(propEvents || []);
  const [loading, setLoading] = useState<boolean>(propLoading !== undefined ? propLoading : true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Fetch events from API only if not provided in props
  useEffect(() => {
    if (propEvents) {
      setEvents(propEvents);
      setLoading(false);
      return;
    }
    
    const getEvents = async () => {
      setLoading(true);
      try {
        const data = await fetchEvents(selectedCategory);
        setEvents(data);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    getEvents();
  }, [selectedCategory, propEvents]);

  // Update state when props change
  useEffect(() => {
    if (propEvents) {
      setEvents(propEvents);
    }
    if (propLoading !== undefined) {
      setLoading(propLoading);
    }
  }, [propEvents, propLoading]);

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

  const handleRefresh = async () => {
    if (onRefresh) {
      await onRefresh();
    } else {
      setLoading(true);
      try {
        const data = await fetchEvents(selectedCategory);
        setEvents(data);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold">Events</h3>
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

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <Spin size="large" />
        </div>
      ) : (
        <div 
          ref={scrollContainerRef}
          onWheel={handleWheel}
          className="mt-6 grid grid-flow-col auto-cols-[280px] gap-6 overflow-x-auto py-4 scrollbar-hide scroll-smooth touch-pan-x"
          style={{ 
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {events.length > 0 ? (
            events.map((event) => (
              <div 
                key={event.id} 
                className="scroll-snap-align-start"
              >
                <EventCard event={event} />
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-gray-500">
              No events found. Try changing category or create a new event.
            </div>
          )}
        </div>
      )}
    </div>
  );
}; 