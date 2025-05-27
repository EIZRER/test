import React from 'react';
import { Button, Avatar, Tooltip, Dropdown } from 'antd';
import { TagOutlined, UserOutlined, PlusOutlined, LogoutOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import { getImageUrl } from '../../services/api';

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
  const { user, loading, clearUser } = useUser();

  const handleLogout = async () => {
    try {
      clearUser();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const menuItems = [
    {
      key: 'profile',
      label: <div onClick={onProfileClick}>Profile</div>
    },
    {
      key: 'logout',
      label: 'Logout',
      icon: <LogoutOutlined />,
      onClick: handleLogout
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center space-x-4">
        <Avatar icon={<UserOutlined />} className="cursor-pointer bg-gray-200" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center space-x-4">
        <Link to="/login">
          <Button type="primary">Login</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-4">
      <Button
        icon={<TagOutlined />}
        onClick={onMyEventsClick}
        className="flex items-center font-medium"
        type="text"
      >
        Миний эвентүүд
      </Button>

      <Tooltip title="Профайл">
        <Dropdown menu={{ items: menuItems }} placement="bottomRight">
          <Avatar
            icon={!user.avatarUrl && <UserOutlined />}
            src={user.avatarUrl ? getImageUrl(user.avatarUrl) : undefined}
            className="cursor-pointer hover:opacity-80"
            size="large"
          />
        </Dropdown>
      </Tooltip>

      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={onAddEventClick}
        className="rounded-full bg-gradient-to-r from-blue-500 to-blue-600 font-medium shadow-md hover:shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all"
        size="middle"
      >
        Эвэнт үүсгэх
      </Button>
    </div>
  );
}; 