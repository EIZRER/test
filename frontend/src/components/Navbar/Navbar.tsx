import React from 'react';
import { Layout } from 'antd';
import { Logo } from './Logo';
import { SearchBar } from './SearchBar';
import { NavbarButtons } from './NavbarButtons';

const { Header } = Layout;

export const Navbar: React.FC = () => {
  const handleSearch = (value: string) => {
    // TODO: Implement search functionality
    console.log('Searching for:', value);
  };

  const handleMyEventsClick = () => {
    // TODO: Navigate to my events page
    console.log('Navigating to my events');
  };

  const handleProfileClick = () => {
    // TODO: Navigate to profile page
    console.log('Navigating to profile');
  };

  const handleAddEventClick = () => {
    // TODO: Open add event form
    console.log('Opening add event form');
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