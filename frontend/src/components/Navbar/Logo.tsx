import React from 'react';
import { Typography } from 'antd';
import { Link } from 'react-router-dom';

const { Title } = Typography;

export const Logo: React.FC = () => {
  return (
    <Link to="/" className="no-underline">
      <div className="flex items-center cursor-pointer hover:opacity-80 transition-opacity">
        <Title level={3} className="!m-0 font-bold">
          <span className="bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">
            G
          </span>
          <span>EM</span>
        </Title>
      </div>
    </Link>
  );
}; 