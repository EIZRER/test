import React from 'react';
import { Layout } from 'antd';
import { Logo } from './Logo';
import { SearchBar } from '../Navbar/SearchBar';
import { NavbarButtons } from '../Navbar/NavbarButtons';
import { useNavigate } from 'react-router-dom';

const { Header } = Layout;

export const Navbar: React.FC = () => {
  const navigate = useNavigate();

  const handleSearch = (value: string) => {
    // TODO: Implement search functionality
    console.log('Searching for:', value);
  };

  const handleMyEventsClick = () => {
    navigate('/my-events');
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleAddEventClick = () => {
    // Navigate to home page with createEvent flag
    navigate('/?createEvent=true');
  };

  return (
    <Header className="bg-white shadow-sm px-4 h-16 flex items-center fixed w-full top-0 z-50">
      <div className="container mx-auto flex items-center justify-between gap-8">
        <Logo />
        <SearchBar onSearch={handleSearch} />
        <NavbarButtons
          onMyEventsClick={handleMyEventsClick}
          onProfileClick={handleProfileClick}
          onAddEventClick={handleAddEventClick}
        />
      </div>
    </Header>
  );
}; 