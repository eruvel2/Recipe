import React, { useState, useEffect } from 'react';
import { Plus, Save, RotateCcw, ChefHat } from 'lucide-react';

function Details({ recipe, onAdd, onUpdate, onReset, canUpdate = false }) {
  const [formData, setFormData] = useState({
    category: '',
    name: '',
    temperature: '',
    cookTime: '',
    ingredients: Array(25).fill('')
  });

  useEffect(() => {
    if (recipe) {
      // Extract numbered ingredients from recipe object
      const ingredients = [];
      for (let i = 1; i <= 25; i++) {
        const val = recipe[`ingredient${i}`];
        if (val) ingredients.push(val);
      }

      // If none found, check if it's already an array (backward compatibility or different schema)
      if (ingredients.length === 0 && recipe.ingredients && Array.isArray(recipe.ingredients)) {
        ingredients.push(...recipe.ingredients);
      }

      // Pad ingredients array to 12 elements
      while (ingredients.length < 25) {
        ingredients.push('');
      }

      setFormData({
        category: recipe.category || '',
        name: recipe.name || '',
        temperature: recipe.temperature || '',
        // API returns 'cooktime', we map it to 'cookTime' state
        cookTime: recipe.cooktime || recipe.cookTime || '',
        ingredients: ingredients.slice(0, 25)
      });
    } else {
      setFormData({
        category: '',
        name: '',
        temperature: '',
        cookTime: '',
        ingredients: Array(25).fill('')
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
      ingredients: Array(12).fill('')
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

  const handleResetInternal = () => {
    // Re-trigger the useEffect logic effectively by resetting to recipe prop or empty
    if (onReset) onReset();

    // We can also just re-run the extraction logic here if needed, 
    // but typically onReset might clear selection in parent. 
    // If we just want to reset form to current recipe state:
    if (recipe) {
      const ingredients = [];
      for (let i = 1; i <= 25; i++) {
        const val = recipe[`ingredient${i}`];
        if (val) ingredients.push(val);
      }
      if (ingredients.length === 0 && recipe.ingredients && Array.isArray(recipe.ingredients)) {
        ingredients.push(...recipe.ingredients);
      }
      while (ingredients.length < 25) {
        ingredients.push('');
      }
      setFormData({
        category: recipe.category || '',
        name: recipe.name || '',
        temperature: recipe.temperature || '',
        cookTime: recipe.cooktime || recipe.cookTime || '',
        ingredients: ingredients.slice(0, 25)
      });
    } else {
      setFormData({
        category: '',
        name: '',
        temperature: '',
        cookTime: '',
        ingredients: Array(12).fill('')
      });
    }
  };

  return (
    <div className="bg-white rounded-md p-6 h-full overflow-y-auto box-border">
      <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-200">
        <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
          <ChefHat size={24} className="text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 m-0">Recipe Details</h2>
      </div>
      <div className="flex flex-col gap-5">
        {/* Aligned form fields */}
        <div className="grid grid-cols-[120px_1fr] items-center gap-3">
          <label className="text-sm font-semibold text-gray-700 text-right">Category:</label>
          <input
            type="text"
            value={formData.category}
            onChange={(e) => handleChange('category', e.target.value)}
            placeholder="Enter category"
            className="px-3 py-1.5 border border-gray-300 rounded-lg outline-none text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/25 transition-all"
          />
        </div>

        <div className="grid grid-cols-[120px_1fr] items-center gap-3">
          <label className="text-sm font-semibold text-gray-700 text-right">Name:</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Enter recipe name"
            className="px-3 py-1.5 border border-gray-300 rounded-lg outline-none text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/25 transition-all"
          />
        </div>

        <div className="grid grid-cols-[120px_1fr] items-center gap-3">
          <label className="text-sm font-semibold text-gray-700 text-right">Temperature:</label>
          <input
            type="text"
            value={formData.temperature}
            onChange={(e) => handleChange('temperature', e.target.value)}
            placeholder="Enter temperature"
            className="px-3 py-1.5 border border-gray-300 rounded-lg outline-none text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/25 transition-all"
          />
        </div>

        <div className="grid grid-cols-[120px_1fr] items-center gap-3">
          <label className="text-sm font-semibold text-gray-700 text-right">Cook Time:</label>
          <input
            type="text"
            value={formData.cookTime}
            onChange={(e) => handleChange('cookTime', e.target.value)}
            placeholder="Enter cook time"
            className="px-3 py-1.5 border border-gray-300 rounded-lg outline-none text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/25 transition-all"
          />
        </div>

        <div className="pt-2">
          <label className="block text-sm font-semibold text-gray-700 mb-3">Ingredients</label>
          <div
            className="flex flex-col gap-2 bg-gray-50 p-4 rounded-lg border border-gray-200"
            style={{
              height: '300px',
              maxHeight: '300px',
              minHeight: '300px',
              overflowY: 'scroll',
              overflowX: 'hidden',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            <div className="grid grid-cols-2 gap-4">
              {/* Left column: Ingredients 1-13 */}
              <div className="flex flex-col gap-2">
                {Array.from({ length: 13 }, (_, i) => (
                  <input
                    key={i}
                    type="text"
                    value={formData.ingredients[i] || ''}
                    onChange={(e) => handleIngredientChange(i, e.target.value)}
                    placeholder={`Ingredient ${i + 1}`}
                    className="px-3 py-1.5 border border-gray-300 rounded-lg outline-none text-sm bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/25 transition-all"
                  />
                ))}
              </div>
              {/* Right column: Ingredients 14-25 */}
              <div className="flex flex-col gap-2">
                {Array.from({ length: 12 }, (_, i) => (
                  <input
                    key={i + 13}
                    type="text"
                    value={formData.ingredients[i + 13] || ''}
                    onChange={(e) => handleIngredientChange(i + 13, e.target.value)}
                    placeholder={`Ingredient ${i + 14}`}
                    className="px-3 py-1.5 border border-gray-300 rounded-lg outline-none text-sm bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/25 transition-all"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button
            onClick={handleAdd}
            className="flex items-center justify-center gap-2 flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg border-none cursor-pointer font-semibold shadow-md hover:from-green-700 hover:to-green-800 transition-all"
          >
            <Plus size={18} />
            Add
          </button>
          <button
            onClick={handleUpdate}
            disabled={!recipe || !canUpdate}
            title={!canUpdate ? "You don't have permission to update recipes" : ""}
            className={`flex items-center justify-center gap-2 flex-1 px-4 py-3 text-white rounded-lg border-none font-semibold shadow-md transition-all ${!recipe || !canUpdate
              ? 'bg-gradient-to-r from-gray-300 to-gray-400 cursor-not-allowed opacity-60'
              : 'bg-gradient-to-r from-yellow-500 to-yellow-600 cursor-pointer hover:from-yellow-600 hover:to-yellow-700'
              }`}
          >
            <Save size={18} />
            Update
          </button>
          <button
            onClick={handleResetInternal}
            className="flex items-center justify-center gap-2 flex-1 px-4 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg border-none cursor-pointer font-semibold shadow-md hover:from-gray-700 hover:to-gray-800 transition-all"
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
