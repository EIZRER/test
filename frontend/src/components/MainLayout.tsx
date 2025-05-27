import React, { useEffect } from 'react';
import { Layout } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { logout } from '../services/api';
import { Navbar } from './Navbar/Navbar';

const { Content } = Layout;

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

  return (
    <Layout className="min-h-screen">
      <Navbar />
      
      <Content className="mt-16">
        {children}
      </Content>
    </Layout>
  );
}; 