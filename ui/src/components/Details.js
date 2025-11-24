import React, { useState, useEffect } from 'react';
import { Plus, Save, RotateCcw, ChefHat } from 'lucide-react';

function Details({ recipe, onAdd, onUpdate, onReset }) {
  const [formData, setFormData] = useState({
    category: '',
    name: '',
    temperature: '',
    cookTime: '',
    ingredients: Array(18).fill('')
  });

  useEffect(() => {
    if (recipe) {
      const ingredients = recipe.ingredients ? [...recipe.ingredients] : [];
      // Pad ingredients array to 18 elements
      while (ingredients.length < 18) {
        ingredients.push('');
      }
      setFormData({
        category: recipe.category || '',
        name: recipe.name || '',
        temperature: recipe.temperature || '',
        cookTime: recipe.cookTime || '',
        ingredients: ingredients.slice(0, 18)
      });
    } else {
      setFormData({
        category: '',
        name: '',
        temperature: '',
        cookTime: '',
        ingredients: Array(18).fill('')
      });
    }
  }, [recipe]);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleIngredientChange = (index, value) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index] = value;
    setFormData(prev => ({
      ...prev,
      ingredients: newIngredients
    }));
  };

  const handleAdd = () => {
    const recipeData = {
      category: formData.category,
      name: formData.name,
      temperature: formData.temperature,
      cookTime: formData.cookTime,
      ingredients: formData.ingredients.filter(ing => ing.trim() !== '')
    };
    onAdd(recipeData);
    // Reset form
    setFormData({
      category: '',
      name: '',
      temperature: '',
      cookTime: '',
      ingredients: Array(18).fill('')
    });
  };

  const handleUpdate = () => {
    const recipeData = {
      category: formData.category,
      name: formData.name,
      temperature: formData.temperature,
      cookTime: formData.cookTime,
      ingredients: formData.ingredients.filter(ing => ing.trim() !== '')
    };
    onUpdate(recipeData);
  };

  const handleReset = () => {
    if (recipe) {
      const ingredients = recipe.ingredients ? [...recipe.ingredients] : [];
      // Pad ingredients array to 18 elements
      while (ingredients.length < 18) {
        ingredients.push('');
      }
      setFormData({
        category: recipe.category || '',
        name: recipe.name || '',
        temperature: recipe.temperature || '',
        cookTime: recipe.cookTime || '',
        ingredients: ingredients.slice(0, 18)
      });
    } else {
      setFormData({
        category: '',
        name: '',
        temperature: '',
        cookTime: '',
        ingredients: Array(18).fill('')
      });
    }
    onReset();
  };

  return (
    <div style={{ backgroundColor: 'white', borderRadius: '4px', padding: '24px', height: '100%', overflowY: 'auto', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ padding: '8px', background: 'linear-gradient(to bottom right, #3b82f6, #2563eb)', borderRadius: '8px' }}>
          <ChefHat size={24} style={{ color: 'white' }} />
        </div>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>Recipe Details</h2>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Aligned form fields */}
        <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', alignItems: 'center', gap: '12px' }}>
          <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151', textAlign: 'right' }}>Category:</label>
          <input
            type="text"
            value={formData.category}
            onChange={(e) => handleChange('category', e.target.value)}
            placeholder="Enter category"
            style={{ padding: '10px 16px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none', fontSize: '14px' }}
            onFocus={(e) => { e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.25)'; }}
            onBlur={(e) => { e.target.style.borderColor = '#d1d5db'; e.target.style.boxShadow = 'none'; }}
          />
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', alignItems: 'center', gap: '12px' }}>
          <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151', textAlign: 'right' }}>Name:</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Enter recipe name"
            style={{ padding: '10px 16px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none', fontSize: '14px' }}
            onFocus={(e) => { e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.25)'; }}
            onBlur={(e) => { e.target.style.borderColor = '#d1d5db'; e.target.style.boxShadow = 'none'; }}
          />
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', alignItems: 'center', gap: '12px' }}>
          <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151', textAlign: 'right' }}>Temperature:</label>
          <input
            type="text"
            value={formData.temperature}
            onChange={(e) => handleChange('temperature', e.target.value)}
            placeholder="Enter temperature"
            style={{ padding: '10px 16px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none', fontSize: '14px' }}
            onFocus={(e) => { e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.25)'; }}
            onBlur={(e) => { e.target.style.borderColor = '#d1d5db'; e.target.style.boxShadow = 'none'; }}
          />
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', alignItems: 'center', gap: '12px' }}>
          <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151', textAlign: 'right' }}>Cook Time:</label>
          <input
            type="text"
            value={formData.cookTime}
            onChange={(e) => handleChange('cookTime', e.target.value)}
            placeholder="Enter cook time"
            style={{ padding: '10px 16px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none', fontSize: '14px' }}
            onFocus={(e) => { e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.25)'; }}
            onBlur={(e) => { e.target.style.borderColor = '#d1d5db'; e.target.style.boxShadow = 'none'; }}
          />
        </div>
        
        <div style={{ paddingTop: '8px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '12px' }}>Ingredients</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', backgroundColor: '#f9fafb', padding: '16px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
            {Array.from({ length: 9 }, (_, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <input
                  type="text"
                  value={formData.ingredients[i * 2] || ''}
                  onChange={(e) => handleIngredientChange(i * 2, e.target.value)}
                  placeholder={`Ingredient ${i * 2 + 1}`}
                  style={{ padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none', fontSize: '14px', backgroundColor: 'white' }}
                  onFocus={(e) => { e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.25)'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#d1d5db'; e.target.style.boxShadow = 'none'; }}
                />
                <input
                  type="text"
                  value={formData.ingredients[i * 2 + 1] || ''}
                  onChange={(e) => handleIngredientChange(i * 2 + 1, e.target.value)}
                  placeholder={`Ingredient ${i * 2 + 2}`}
                  style={{ padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none', fontSize: '14px', backgroundColor: 'white' }}
                  onFocus={(e) => { e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.25)'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#d1d5db'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
            ))}
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '12px', paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
          <button 
            onClick={handleAdd} 
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', flex: 1, padding: '12px 16px', background: 'linear-gradient(to right, #16a34a, #15803d)', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '600', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
            onMouseEnter={(e) => { e.target.style.background = 'linear-gradient(to right, #15803d, #166534)'; }}
            onMouseLeave={(e) => { e.target.style.background = 'linear-gradient(to right, #16a34a, #15803d)'; }}
          >
            <Plus size={18} />
            Add
          </button>
          <button 
            onClick={handleUpdate} 
            disabled={!recipe}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '8px', 
              flex: 1, 
              padding: '12px 16px', 
              background: !recipe ? 'linear-gradient(to right, #d1d5db, #9ca3af)' : 'linear-gradient(to right, #eab308, #ca8a04)', 
              color: 'white', 
              borderRadius: '8px', 
              border: 'none', 
              cursor: !recipe ? 'not-allowed' : 'pointer', 
              fontWeight: '600', 
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              opacity: !recipe ? 0.6 : 1
            }}
            onMouseEnter={(e) => { if (recipe) e.target.style.background = 'linear-gradient(to right, #ca8a04, #a16207)'; }}
            onMouseLeave={(e) => { if (recipe) e.target.style.background = 'linear-gradient(to right, #eab308, #ca8a04)'; }}
          >
            <Save size={18} />
            Update
          </button>
          <button 
            onClick={handleReset} 
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', flex: 1, padding: '12px 16px', background: 'linear-gradient(to right, #4b5563, #374151)', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '600', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
            onMouseEnter={(e) => { e.target.style.background = 'linear-gradient(to right, #374151, #1f2937)'; }}
            onMouseLeave={(e) => { e.target.style.background = 'linear-gradient(to right, #4b5563, #374151)'; }}
          >
            <RotateCcw size={18} />
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}

export default Details;

