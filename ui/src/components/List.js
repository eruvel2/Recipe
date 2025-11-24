import React from 'react';
import { BookOpen } from 'lucide-react';

function List({ recipes, selectedRecipe, onRecipeSelect }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '16px', background: 'linear-gradient(to right, #2563eb, #1d4ed8)', color: 'white' }}>
        <BookOpen size={22} />
        <h2 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>Recipe List</h2>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', height: '100%', minHeight: '450px' }}>
        {recipes.length === 0 ? (
          <div style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>No recipes found</div>
        ) : (
          <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
            {recipes.map(recipe => (
              <li
                key={recipe.id}
                onClick={() => onRecipeSelect(recipe)}
                style={{
                  padding: '12px 16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  backgroundColor: selectedRecipe?.id === recipe.id ? '#dbeafe' : 'white',
                  color: selectedRecipe?.id === recipe.id ? '#1e40af' : '#1f2937',
                  fontWeight: selectedRecipe?.id === recipe.id ? '600' : '400',
                  borderLeft: selectedRecipe?.id === recipe.id ? 'none' : 'none',
                  borderBottom: '1px solid #e5e7eb'
                }}
                onMouseEnter={(e) => {
                  if (selectedRecipe?.id !== recipe.id) {
                    e.currentTarget.style.backgroundColor = '#f9fafb';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedRecipe?.id !== recipe.id) {
                    e.currentTarget.style.backgroundColor = 'white';
                  }
                }}
              >
                {recipe.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default List;

