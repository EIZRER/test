import React, { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { MainLayout } from '../components/MainLayout';
import Map from './MapPage/MapPage';
import { EventList } from '../components/EventList';
import { fetchEvents } from '../services/api';
import { Event } from '../types/event';
import { message } from 'antd';

const HomePage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  
  // Check if createEvent query parameter exists
  const shouldCreateEvent = new URLSearchParams(location.search).get('createEvent') === 'true';

  // Fetch events on component mount - extracted to reusable function
  const getEvents = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchEvents();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
      message.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getEvents();
  }, [getEvents]);

  // Handle adding a new event to the list
  const handleEventAdded = (newEvent: Event) => {
    setEvents(prevEvents => [...prevEvents, newEvent]);
    message.success('Event added successfully and has been added to your events list!');
  };

  return (
    <MainLayout>
      <div className="flex flex-col w-full">
        {/* Map section */}
        <div className="w-full h-[60vh] md:h-[65vh] relative border-b border-gray-200">
          <Map 
            initialCreateEvent={shouldCreateEvent} 
            onEventAdded={handleEventAdded}
          />
        </div>
        
        {/* Event listing section */}
        <section className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">Upcoming Events</h2>
            <p className="text-gray-600">Discover and join exciting events near you</p>
          </div>
          <EventList 
            events={events} 
            loading={loading}
            onRefresh={getEvents} 
          />
        </section>
      </div>
    </MainLayout>
  );
};

export default HomePage;
