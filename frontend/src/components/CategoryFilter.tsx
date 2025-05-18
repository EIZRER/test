import React from 'react';
import { CategoryFilter as CategoryFilterType, EventCategory } from '../types/event';
import { Radio, Space } from 'antd';
import type { RadioChangeEvent } from 'antd';

interface CategoryFilterProps {
  categories: CategoryFilterType[];
  selectedCategory: EventCategory;
  onCategoryChange: (category: EventCategory) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
}) => {
  const handleChange = (e: RadioChangeEvent) => {
    onCategoryChange(e.target.value as EventCategory);
  };

  return (
    <Radio.Group
      value={selectedCategory}
      onChange={handleChange}
      className="w-full overflow-x-auto py-4"
    >
      <Space wrap={false} size={12}>
        {categories.map((category) => (
          <Radio.Button
            key={category.id}
            value={category.label}
            className="whitespace-nowrap"
          >
            {category.icon} {category.label}
          </Radio.Button>
        ))}
      </Space>
    </Radio.Group>
  );
}; 