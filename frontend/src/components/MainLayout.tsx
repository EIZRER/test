import React from 'react';
import { Layout } from 'antd';
import { Navbar } from './Navbar/Navbar';

const { Content, Footer } = Layout;

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <Layout className="min-h-screen">
      {/* Fixed navbar */}
      <Navbar />
      
      {/* Main content area with padding for fixed header */}
      <Content className="pt-16">
        {children}
      </Content>
      
      <Footer className="text-center bg-white border-t py-4">
        <div className="container mx-auto">
          Live Event Map &copy; {new Date().getFullYear()} | All rights reserved
        </div>
      </Footer>
    </Layout>
  );
}; 