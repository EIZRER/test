import React from 'react';
import { Event } from '../types/event';
import { CalendarOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { Card, Button, Typography } from 'antd';

const { Text, Title } = Typography;

interface EventCardProps {
  event: Event;
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  return (
    <Card
      hoverable
      cover={
        <div className="aspect-[3/2] overflow-hidden">
          <img
            alt={event.title}
            src={event.imageUrl}
            className="w-full h-full object-cover"
          />
        </div>
      }
      className="w-full h-full flex flex-col"
      bodyStyle={{ flex: 1, display: 'flex', flexDirection: 'column' }}
    >
      <div className="flex-1">
        <Title level={5} ellipsis={{ rows: 2 }} className="!mt-0 !mb-4">
          {event.title}
        </Title>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center">
            <CalendarOutlined className="mr-2 text-gray-600" />
            <Text type="secondary">{event.date}</Text>
          </div>
          
          <div className="flex items-center">
            <EnvironmentOutlined className="mr-2 text-gray-600" />
            <Text type="secondary" ellipsis>
              {event.venue}
            </Text>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-auto pt-4 border-t">
        <Text strong className="text-lg">
          {event.price.toLocaleString()}₮
        </Text>
        <Button type="primary">
          Тасалбар авах
        </Button>
      </div>
    </Card>
  );
}; 