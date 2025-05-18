import React from 'react';
import { Typography } from 'antd';

const { Title } = Typography;

export const Logo: React.FC = () => {
  return (
    <div className="flex items-center cursor-pointer">
      <Title level={3} className="!m-0 font-bold">
        <span className="bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">
          G
        </span>
        <span>EM</span>
      </Title>
    </div>
  );
}; 