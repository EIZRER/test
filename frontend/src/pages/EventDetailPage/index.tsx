import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Button, Card, Skeleton, Tag, message, Divider, Typography, Space, Row, Col, Avatar } from 'antd';
import { CalendarOutlined, EnvironmentOutlined, UserOutlined, ShareAltOutlined, HeartOutlined, HeartFilled } from '@ant-design/icons';
import axios from 'axios';
import { MainLayout } from '../../components/MainLayout';
import EventInfo from '../EventDetailPage/EventInfo';
import EventImage from './EventImg';
import EventMeta from './EventMeta';
import EventLocation from './EventLocation';
import { fetchEventById } from '../../services/api';
import type { Event } from './types';
import { useUser } from '../../contexts/UserContext';

const { Title, Text, Paragraph } = Typography;

export default function EventDetailPage() {
  const { id } = useParams();
  const { user } = useUser();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);
  const [attending, setAttending] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!id) return;
        
        const eventData = await fetchEventById(id);
        setEvent(eventData);
        
        // Check if user is attending this event (mock functionality)
        // In a real app, this would come from the backend
        setAttending(Math.random() > 0.5);
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

  const handleAttendToggle = () => {
    if (!event || !user) return;
    
    // Toggle attending status
    const newAttendingStatus = !attending;
    setAttending(newAttendingStatus);
    
    // Show feedback
    message.success(newAttendingStatus 
      ? `You are now attending ${event.title}` 
      : `You are no longer attending ${event.title}`
    );
    
    // In a real app, you would call an API here
    // Example: api.toggleEventAttendance(event.id, newAttendingStatus)
  };

  const handleLikeToggle = () => {
    setLiked(!liked);
    // In a real app, you would call an API here
  };
  
  const handleShare = () => {
    // Simple share function - in a real app, this would use the Web Share API
    // or show a modal with sharing options
    if (navigator.share) {
      navigator.share({
        title: event?.title || 'Check out this event!',
        text: event?.description || 'Interesting event I found',
        url: window.location.href,
      });
    } else {
      // Fallback for browsers that don't support the Web Share API
      const url = window.location.href;
      navigator.clipboard.writeText(url);
      message.success('Event link copied to clipboard!');
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'TBD';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  let content;
  
  if (loading) {
    content = (
      <Card className="shadow-md rounded-xl overflow-hidden">
        <Skeleton.Image className="w-full h-80" active />
        <div className="p-6">
          <Skeleton active paragraph={{ rows: 6 }} />
        </div>
      </Card>
    );
  } else if (error) {
    content = (
      <div className="text-center p-8 text-red-500 bg-red-50 rounded-lg">
        {error}
      </div>
    );
  } else if (!event) {
    content = (
      <div className="text-center p-8 bg-gray-50 rounded-lg">
        Event not found
      </div>
    );
  } else {
    content = (
      <div className="space-y-6">
        <Card className="overflow-hidden shadow-md rounded-xl">
          <div className="relative">
            <div 
              className="w-full h-80 bg-cover bg-center"
              style={{
                backgroundImage: `url(${event.imageUrl || '/images/event-placeholder.jpg'})`,
                filter: 'brightness(85%)'
              }}
            />
            
            <div className="absolute top-6 right-6 flex gap-2">
              <Button 
                shape="circle" 
                icon={liked ? <HeartFilled className="text-red-500" /> : <HeartOutlined />} 
                onClick={handleLikeToggle}
                className="bg-white shadow-md"
              />
              <Button 
                shape="circle" 
                icon={<ShareAltOutlined />} 
                onClick={handleShare}
                className="bg-white shadow-md"
              />
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Tag color="blue">{event.category}</Tag>
                  {event.status && (
                    <Tag color={event.status === 'active' ? 'green' : 'orange'}>
                      {event.status === 'active' ? 'Active' : 'Completed'}
                    </Tag>
                  )}
                </div>
                
                <Title level={2} className="mb-2">
                  {event.title}
                </Title>
              </div>
              
              <Button 
                type={attending ? "default" : "primary"}
                size="large"
                onClick={handleAttendToggle}
              >
                {attending ? 'Cancel Attendance' : 'Attend Event'}
              </Button>
            </div>
            
            <Row gutter={[24, 24]}>
              <Col xs={24} md={16}>
                <Card className="shadow-sm">
                  <Title level={4}>About This Event</Title>
                  <Paragraph className="text-lg whitespace-pre-line">
                    {event.description}
                  </Paragraph>
                </Card>
              </Col>
              
              <Col xs={24} md={8}>
                <Card className="shadow-sm mb-6">
                  <Space direction="vertical" className="w-full">
                    <div>
                      <Text type="secondary" className="block">Date & Time</Text>
                      <div className="flex items-center gap-2 mt-1">
                        <CalendarOutlined className="text-blue-500" />
                        <Text strong>{formatDate(event.date)}</Text>
                      </div>
                      {event.time && (
                        <Text className="ml-6 block mt-1">{event.time}</Text>
                      )}
                    </div>
                    
                    <Divider className="my-3" />
                    
                    <div>
                      <Text type="secondary" className="block">Location</Text>
                      <div className="flex items-center gap-2 mt-1">
                        <EnvironmentOutlined className="text-blue-500" />
                        <Text strong>{event.location?.address || 'To be announced'}</Text>
                      </div>
                    </div>
                    
                    <Divider className="my-3" />
                    
                    <div>
                      <Text type="secondary" className="block">Organizer</Text>
                      <div className="flex items-center gap-2 mt-1">
                        <Avatar icon={<UserOutlined />} />
                        <Text strong>{event.organizer?.name || 'Anonymous'}</Text>
                      </div>
                    </div>
                  </Space>
                </Card>
                
                {event.location?.address && (
                  <Card className="shadow-sm">
                    <iframe
                      title="Event Location"
                      width="100%"
                      height="200"
                      frameBorder="0"
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(event.location.address)}&output=embed`}
                      allowFullScreen
                    />
                  </Card>
                )}
              </Col>
            </Row>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-100 py-8 px-4">
        <div className="container mx-auto max-w-5xl">
          {content}
        </div>
      </div>
    </MainLayout>
  );
}
