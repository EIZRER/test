import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import EventInfo from '../EventDetailPage/EventInfo';
import EventImage from './EventImg';
import EventMeta from './EventMeta';
import EventLocation from './EventLocation';
import type { Event } from './types';

export default function EventDetailPage() {
  const { id } = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`/api/events/${id}`);
        setEvent(response.data);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 404) {
            setError('Event not found');
          } else {
            setError('Failed to load event. Please try again later.');
          }
        } else {
          setError('An unexpected error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (loading) return (
    <div className="w-full h-[600px] bg-gray-200 animate-pulse rounded-lg" />
  );
  
  if (error) return (
    <div className="text-center p-8 text-red-500 bg-red-50 rounded-lg">
      {error}
    </div>
  );
  
  if (!event) return (
    <div className="text-center p-8 bg-gray-50 rounded-lg">
      Event not found
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <EventImage imageUrl={event.imageUrl} title={event.title} />
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6">
          <EventInfo 
            title={event.title} 
            description={event.description} 
            date={event.date} 
            time={event.time} 
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <EventLocation address={event.location.address} />
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <EventMeta category={event.category} organizer={event.organizer} />
          </div>
        </div>
      </div>
    </div>
  );
}
