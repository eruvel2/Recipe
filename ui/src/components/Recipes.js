import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import List from './List';
import Details from './Details';
import Search from './Search';
import Categories from './Categories';

function Recipes() {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Filter recipes based on search and category
  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || recipe.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredRecipes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedRecipes = filteredRecipes.slice(startIndex, endIndex);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  const handleAdd = (recipeData) => {
    const newRecipe = {
      id: Date.now(),
      ...recipeData
    };
    setRecipes([...recipes, newRecipe]);
    setSelectedRecipe(null);
  };

  const handleUpdate = (recipeData) => {
    if (!selectedRecipe) return;
    
    setRecipes(recipes.map(recipe => 
      recipe.id === selectedRecipe.id 
        ? { ...recipe, ...recipeData }
        : recipe
    ));
    setSelectedRecipe(null);
  };

  const handleReset = () => {
    setSelectedRecipe(null);
  };

  const handleRecipeSelect = (recipe) => {
    setSelectedRecipe(recipe);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Find recipe index for search positioning
  const findRecipeIndex = (term) => {
    if (!term) return;
    const index = filteredRecipes.findIndex(recipe => 
      recipe.name.toLowerCase().includes(term.toLowerCase())
    );
    if (index !== -1) {
      const page = Math.floor(index / itemsPerPage) + 1;
      setCurrentPage(page);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #dbeafe, #ffffff, #f3e8ff)', padding: '24px', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: '1280px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 'bold', textAlign: 'center', background: 'linear-gradient(to right, #2563eb, #9333ea)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Recipe Manager
          </h1>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'row', gap: '24px', alignItems: 'stretch', flexWrap: 'wrap', minHeight: 'calc(100vh - 200px)' }}>
            {/* Left Panel */}
            <div style={{ flex: '1', minWidth: '400px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Recipe List - Extended with box */}
              <div style={{ border: '2px solid #3b82f6', borderRadius: '12px', padding: '8px', backgroundColor: '#78ddde', flex: '1', display: 'flex', flexDirection: 'column', minHeight: '500px' }}>
                <List 
                  recipes={paginatedRecipes}
                  selectedRecipe={selectedRecipe}
                  onRecipeSelect={handleRecipeSelect}
                />
              </div>
            </div>
            
            {/* Right Panel - Details (to the right of List) with box */}
            <div style={{ flex: '1', minWidth: '400px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ border: '2px solid #3b82f6', borderRadius: '12px', padding: '8px', backgroundColor: '#78ddde', height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
                <Details 
                  recipe={selectedRecipe}
                  onAdd={handleAdd}
                  onUpdate={handleUpdate}
                  onReset={handleReset}
                />
              </div>
            </div>
          </div>
          
          {/* Search, Categories and Pagination at the bottom - spanning full width */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Search and Categories - Side by side with box - stretched to full width */}
            <div style={{ border: '2px solid #3b82f6', borderRadius: '12px', padding: '8px', backgroundColor: '#78ddde', boxSizing: 'border-box', width: '100%' }}>
              <div style={{ display: 'flex', flexDirection: 'row', gap: '16px', flexWrap: 'wrap', alignItems: 'stretch' }}>
                <div style={{ flex: '1', minWidth: '200px', display: 'flex', boxSizing: 'border-box' }}>
                  <Search onSearch={handleSearch} onFind={findRecipeIndex} />
                </div>
                <div style={{ flex: '1', minWidth: '200px', display: 'flex', boxSizing: 'border-box' }}>
                  <Categories 
                    recipes={recipes} 
                    selectedCategory={selectedCategory}
                    onCategorySelect={handleCategorySelect}
                  />
                </div>
              </div>
            </div>
            
            {/* Pagination */}
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: '12px', padding: '16px', backgroundColor: '#78ddde', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb', flexWrap: 'wrap' }}>
              <button 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '4px', 
                  padding: '8px 16px', 
                  background: currentPage === 1 ? '#d1d5db' : 'linear-gradient(to right, #2563eb, #1d4ed8)', 
                  color: 'white', 
                  borderRadius: '8px', 
                  border: 'none', 
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer', 
                  whiteSpace: 'nowrap',
                  opacity: currentPage === 1 ? 0.6 : 1
                }}
              >
                <ChevronLeft size={20} />
                Previous
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '500', color: '#374151', whiteSpace: 'nowrap' }}>
                <span>Page</span>
                <input 
                  type="number" 
                  min="1" 
                  max={totalPages || 1}
                  value={currentPage}
                  onChange={(e) => handlePageChange(parseInt(e.target.value) || 1)}
                  style={{ width: '64px', padding: '4px 8px', textAlign: 'center', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none' }}
                />
                <span>of {totalPages || 1}</span>
              </div>
              <button 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '4px', 
                  padding: '8px 16px', 
                  background: currentPage >= totalPages ? '#d1d5db' : 'linear-gradient(to right, #2563eb, #1d4ed8)', 
                  color: 'white', 
                  borderRadius: '8px', 
                  border: 'none', 
                  cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer', 
                  whiteSpace: 'nowrap',
                  opacity: currentPage >= totalPages ? 0.6 : 1
                }}
              >
                Next
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Recipes;

