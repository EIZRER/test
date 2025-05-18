import React from 'react';
import { Card, Button, Empty } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
import { Event } from '../../types/event';

interface MyEventsProps {
  events?: Event[];
  onViewAllClick: () => void;
}

export const MyEvents: React.FC<MyEventsProps> = ({
  events = [],
  onViewAllClick,
}) => {
  return (
    <Card className="shadow-md">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <CalendarOutlined className="text-lg" />
          <h2 className="text-lg font-semibold m-0">Миний эвентүүд</h2>
        </div>
        <Button type="primary" onClick={onViewAllClick}>
          Эвент харах
        </Button>
      </div>

      {events.length > 0 ? (
        <div className="space-y-4">
          {events.slice(0, 3).map((event) => (
            <div
              key={event.id}
              className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <img
                src={event.imageUrl}
                alt={event.title}
                className="w-16 h-16 object-cover rounded"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-base truncate">{event.title}</h3>
                <p className="text-gray-500 text-sm">{event.date}</p>
              </div>
              <div className="text-right">
                <div className="font-medium">{event.price.toLocaleString()}₮</div>
                <div className="text-sm text-gray-500">{event.category}</div>
              </div>
            </div>
          ))}
          {events.length > 3 && (
            <div className="text-center pt-2">
              <Button type="link" onClick={onViewAllClick}>
                Бүгдийг харах ({events.length})
              </Button>
            </div>
          )}
        </div>
      ) : (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="Та одоогоор эвент захиалаагүй байна"
        />
      )}
    </Card>
  );
}; 