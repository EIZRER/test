import React from 'react';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import styles from './SearchBar.module.css';

interface SearchBarProps {
  onSearch: (value: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  return (
    <div className="max-w-xl w-full">
      <Input
        placeholder="Хайх"
        prefix={<SearchOutlined className="text-gray-400" />}
        onChange={(e) => onSearch(e.target.value)}
        className={`${styles.searchInput} rounded-full border-2 border-transparent hover:border-blue-500 focus:border-blue-500`}
        style={{
          background: 'white',
          padding: '8px 16px',
          height: '42px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }}
      />
    </div>
  );
}; 