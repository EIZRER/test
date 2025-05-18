import React from 'react';
import { Button, Avatar, Tooltip } from 'antd';
import { TagOutlined, UserOutlined, PlusOutlined } from '@ant-design/icons';

interface NavbarButtonsProps {
  onMyEventsClick: () => void;
  onProfileClick: () => void;
  onAddEventClick: () => void;
}

export const NavbarButtons: React.FC<NavbarButtonsProps> = ({
  onMyEventsClick,
  onProfileClick,
  onAddEventClick,
}) => {
  return (
    <div className="flex items-center space-x-4">
      <Button
        icon={<TagOutlined />}
        onClick={onMyEventsClick}
        className="flex items-center"
        type="text"
      >
        Миний эвентүүд
      </Button>

      <Tooltip title="Профайл">
        <Avatar
          icon={<UserOutlined />}
          className="cursor-pointer hover:opacity-80"
          onClick={onProfileClick}
        />
      </Tooltip>

      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={onAddEventClick}
        className="rounded-full bg-gradient-to-r from-blue-500 to-blue-600"
      >
        Эвэнт үүсгэх
      </Button>
    </div>
  );
}; 