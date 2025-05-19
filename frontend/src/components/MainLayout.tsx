import React, { useEffect } from 'react';
import { Layout, Menu, Button, Avatar, Dropdown } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useUser } from '../contexts/UserContext';
import { logout } from '../services/api';
import { getImageUrl } from '../services/api';

const { Header, Content } = Layout;

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, clearUser, loading, error } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('MainLayout user state:', { user, loading, error });
  }, [user, loading, error]);

  const handleLogout = async () => {
    try {
      await logout();
      clearUser();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const menuItems = [
    {
      key: 'profile',
      label: <Link to="/profile">Profile</Link>
    },
    {
      key: 'logout',
      label: 'Logout',
      icon: <LogoutOutlined />,
      onClick: handleLogout
    }
  ];

  return (
    <Layout className="min-h-screen">
      <Header className="bg-white px-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="text-xl font-bold mr-8">
            Live Event Map
          </Link>
          <Menu mode="horizontal" className="border-0">
            <Menu.Item key="map">
              <Link to="/map">Map</Link>
            </Menu.Item>
            <Menu.Item key="events">
              <Link to="/events">Events</Link>
            </Menu.Item>
            {user && (
              <Menu.Item key="my-events">
                <Link to="/my-events">My Events</Link>
              </Menu.Item>
            )}
          </Menu>
        </div>
        
        <div>
          {loading ? (
            <Avatar icon={<UserOutlined />} className="cursor-pointer bg-gray-200" />
          ) : user ? (
            <Dropdown menu={{ items: menuItems }} placement="bottomRight">
              <div className="cursor-pointer">
                <Avatar 
                  src={user.avatarUrl ? getImageUrl(user.avatarUrl) : undefined}
                  icon={!user.avatarUrl && <UserOutlined />}
                  className="cursor-pointer"
                />
              </div>
            </Dropdown>
          ) : (
            <Link to="/login">
              <Button type="primary">Login</Button>
            </Link>
          )}
        </div>
      </Header>
      
      <Content>
        {children}
      </Content>
    </Layout>
  );
}; 