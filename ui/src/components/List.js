import React from 'react';
import { BookOpen } from 'lucide-react';

function List({ recipes, selectedRecipe, onRecipeSelect }) {
  return (
    <div className="flex flex-col bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden h-full">
      <div className="flex items-center gap-2 p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <BookOpen size={22} />
        <h2 className="text-lg font-semibold m-0">Recipe List</h2>
      </div>
      <div className="flex-1 overflow-y-auto min-h-0">
        {recipes.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No recipes found</div>
        ) : (
          <ul className="m-0 p-0 list-none">
            {recipes.map(recipe => (
              <li
                key={recipe.id || recipe.name}
                onClick={() => onRecipeSelect(recipe)}
                className={`px-3 py-1.5 cursor-pointer transition-all border-b border-gray-200 text-sm ${(selectedRecipe?.id && recipe.id && selectedRecipe.id === recipe.id) ||
                    (selectedRecipe?.name === recipe.name)
                    ? 'bg-blue-100 text-blue-800 font-semibold'
                    : 'bg-white text-gray-800 hover:bg-gray-50'
                  }`}
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

