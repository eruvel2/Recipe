import React, { useMemo } from 'react';
import { Tag } from 'lucide-react';

function Categories({ recipes, selectedCategory, onCategorySelect }) {
  const categories = useMemo(() => {
    const cats = new Set();
    recipes.forEach(recipe => {
      if (recipe.category && recipe.category.trim() !== '') {
        cats.add(recipe.category);
      }
    });
    return Array.from(cats).sort();
  }, [recipes]);

  const handleChange = (e) => {
    onCategorySelect(e.target.value);
  };

  return (
    <div style={{ backgroundColor: 'white', borderRadius: '4px', padding: '16px', height: '100%', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
        <div style={{ padding: '6px', backgroundColor: '#f3e8ff', borderRadius: '6px' }}>
          <Tag size={16} style={{ color: '#9333ea' }} />
        </div>
        <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#374151', margin: 0 }}>Categories</h3>
      </div>
      <select
        value={selectedCategory || ''}
        onChange={handleChange}
        style={{
          width: '100%',
          padding: '10px 12px',
          border: '1px solid #d1d5db',
          borderRadius: '8px',
          fontSize: '14px',
          backgroundColor: 'white',
          color: '#1f2937',
          cursor: 'pointer',
          outline: 'none',
          flex: '1',
          alignSelf: 'flex-end'
        }}
        onFocus={(e) => {
          e.target.style.borderColor = '#3b82f6';
          e.target.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.25)';
        }}
        onBlur={(e) => {
          e.target.style.borderColor = '#d1d5db';
          e.target.style.boxShadow = 'none';
        }}
      >
        <option value="">All</option>
        {categories.map(category => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Categories;

