import React from 'react';

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'raw-coconuts', name: 'Raw Coconuts' },
    { id: 'coconut-oil', name: 'Coconut Oil' },
    { id: 'coconut-water', name: 'Coconut Water' },
    { id: 'coir', name: 'Coir Products' },
    { id: 'copra', name: 'Copra' },
    { id: 'coconut-sugar', name: 'Coconut Sugar' },
    { id: 'equipment', name: 'Processing Equipment' }
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Categories</h2>
      <div className="space-y-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
              selectedCategory === category.id
                ? 'bg-green-100 text-green-800'
                : 'hover:bg-gray-100'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
}