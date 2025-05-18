import React, { useEffect, useState } from 'react';
import { MainLayout } from '../components/MainLayout';
import { Card, Typography, List, Tag, Avatar, Empty, Spin, Button } from 'antd';
import { CalendarOutlined, EnvironmentOutlined, UserOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { getUserEvents } from '../services/api';
import { useUser } from '../contexts/UserContext';
import { Event } from '../types/event';

const { Title, Text } = Typography;

const MyEventsPage: React.FC = () => {
  const { user } = useUser();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserEvents = async () => {
      if (!user?._id) return;
      
      try {
        setLoading(true);
        const response = await getUserEvents(user._id);
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching user events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserEvents();
  }, [user]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('mn-MN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <Card className="shadow-sm mb-6">
            <div className="flex items-center justify-between mb-4">
              <Title level={3} className="mb-0">Миний Эвентүүд</Title>
            </div>
            <Text className="text-gray-500 block mb-6">
              Эдгээр нь таны хамрагдаж байгаа бүх эвентүүд юм.
            </Text>

            {loading ? (
              <div className="flex justify-center py-10">
                <Spin size="large" />
              </div>
            ) : events.length > 0 ? (
              <List
                dataSource={events}
                renderItem={(event) => (
                  <List.Item>
                    <Card className="w-full shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="w-full md:w-1/4">
                          <div 
                            className="h-48 rounded-lg bg-cover bg-center"
                            style={{ backgroundImage: `url(${event.imageUrl || '/images/event-placeholder.jpg'})` }}
                          />
                        </div>
                        <div className="w-full md:w-3/4">
                          <div className="flex flex-col h-full justify-between">
                            <div>
                              <Link to={`/events/${event._id}`}>
                                <Title level={4} className="mb-2 hover:text-blue-500">
                                  {event.title}
                                </Title>
                              </Link>
                              
                              <div className="flex items-center gap-3 mb-2">
                                <Tag color="blue">{event.category}</Tag>
                              </div>
                              
                              <div className="flex flex-col gap-2 mb-4">
                                <div className="flex items-center gap-2">
                                  <CalendarOutlined className="text-gray-500" />
                                  <Text>{formatDate(event.date)}</Text>
                                  {event.time && (
                                    <Text className="text-gray-500 ml-2">{event.time}</Text>
                                  )}
                                </div>
                                
                                <div className="flex items-center gap-2">
                                  <EnvironmentOutlined className="text-gray-500" />
                                  <Text className="text-gray-600">
                                    {event.location?.address || 'Хаяг оруулаагүй байна'}
                                  </Text>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                  <UserOutlined className="text-gray-500" />
                                  <Text className="text-gray-600">
                                    {event.organizer?.name || 'Unknown'}
                                  </Text>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex justify-end">
                              <Link to={`/events/${event._id}`}>
                                <Button type="primary">Дэлгэрэнгүй</Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </List.Item>
                )}
              />
            ) : (
              <Empty
                description="Та одоогоор ямар ч эвэнтэд хамрагдаагүй байна"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                className="py-10"
              >
                <Link to="/">
                  <Button type="primary">Эвентүүд харах</Button>
                </Link>
              </Empty>
            )}
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default MyEventsPage; 