import React from 'react';
import { Card } from 'antd';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="fixed inset-0 w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 overflow-auto">
      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
      
      <Card 
        className="w-full max-w-[450px] shadow-2xl relative z-10 border-0 m-4"
        style={{ 
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)'
        }}
      >
        {children}
      </Card>
    </div>
  );
}; 