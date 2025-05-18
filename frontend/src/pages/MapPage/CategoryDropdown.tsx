import React, { useState, useEffect, useRef } from 'react';

interface CategoryDropdownProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

const categories = [
  { label: "Restaurants 🍴", value: "restaurant" },
  { label: "Cafes ☕", value: "cafe" },
  { label: "Hotels 🏨", value: "lodging" },
  { label: "Parks 🌳", value: "park" },
  { label: "Tourist Attractions 🎡", value: "tourist_attraction" },
];

const CategoryDropdown: React.FC<CategoryDropdownProps> = ({
  selectedCategory,
  setSelectedCategory,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedLabel =
    categories.find((cat) => cat.value === selectedCategory)?.label || 'Select Category';

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      ref={dropdownRef}
      style={{
        position: 'absolute',
        top: '10px',
        left: '25%',
        zIndex: 10,
        width: '100%',
        maxWidth: '240px',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          padding: '12px 16px',
          borderRadius: '10px',
          backgroundColor: 'white',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          fontWeight: 500,
          fontSize: '15px',
          cursor: 'pointer',
          transition: 'box-shadow 0.2s',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {selectedLabel}
        <span style={{ marginLeft: '10px' }}>▾</span>
      </div>

      {isOpen && (
        <ul
          style={{
            margin: '6px 0 0 0',
            padding: 0,
            borderRadius: '10px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            backgroundColor: 'white',
            maxHeight: '240px',
            overflowY: 'auto',
            listStyle: 'none',
          }}
        >
          {categories.map((cat) => (
            <li
              key={cat.value}
              onClick={() => {
                setSelectedCategory(cat.value);
                setIsOpen(false);
              }}
              style={{
                padding: '12px 16px',
                cursor: 'pointer',
                backgroundColor:
                  cat.value === selectedCategory ? '#f1f3f4' : 'white',
                fontWeight: cat.value === selectedCategory ? 'bold' : 'normal',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f1f3f4';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor =
                  cat.value === selectedCategory ? '#f1f3f4' : 'white';
              }}
            >
              {cat.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CategoryDropdown;