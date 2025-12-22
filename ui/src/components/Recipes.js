import React, { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, LogOut } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from './firebase';
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
  const [canUpdate, setCanUpdate] = useState(false);
  const itemsPerPage = 18;

  // Get user permissions from localStorage
  useEffect(() => {
    const userData = localStorage.getItem('user');
    console.log('Raw localStorage user data:', userData);
    if (userData) {
      try {
        const user = JSON.parse(userData);
        console.log('Parsed user object:', user);
        console.log('canUpdate value:', user.canUpdate);
        console.log('canUpdate type:', typeof user.canUpdate);
        setCanUpdate(user.canUpdate || false);
        console.log('Set canUpdate to:', user.canUpdate || false);
      } catch (error) {
        console.error('Error parsing user data:', error);
        setCanUpdate(false);
      }
    }
  }, []);

  // Fetch recipes on mount
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        // Get the current user's ID token
        const user = auth.currentUser;
        if (!user) {
          console.error('No authenticated user');
          return;
        }

        const idToken = await user.getIdToken();

        const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3000'}/api/recipes`, {
          headers: {
            'Authorization': `Bearer ${idToken}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch recipes');
        }

        const data = await response.json();
        setRecipes(data);
      } catch (err) {
        console.error('Error fetching recipes:', err);
      }
    };

    fetchRecipes();
  }, []);

  // Memoize filtered recipes to prevent recalculation on every render
  const filteredRecipes = useMemo(() => {
    return recipes.filter(recipe => {
      const matchesSearch = recipe.name ? recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) : false;
      const matchesCategory = !selectedCategory || recipe.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [recipes, searchTerm, selectedCategory]);

  // Memoize paginated recipes
  const paginatedRecipes = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredRecipes.slice(startIndex, endIndex);
  }, [filteredRecipes, currentPage, itemsPerPage]);

  // Calculate total pages
  const totalPages = Math.ceil(filteredRecipes.length / itemsPerPage);

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

  const handleUpdate = async (recipeData) => {
    if (!selectedRecipe) return;

    try {
      // Get the current user's ID token
      const user = auth.currentUser;
      if (!user) {
        console.error('No authenticated user');
        return;
      }

      const idToken = await user.getIdToken();

      // Use the original name from selectedRecipe for the URL
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3000'}/api/recipes/${encodeURIComponent(selectedRecipe.name)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify(recipeData),
      });

      if (!response.ok) throw new Error('Failed to update recipe');

      const updatedRecipe = await response.json();

      // Update the list with the new data
      setRecipes(recipes.map(recipe =>
        // Match by ID if available, otherwise by original name
        (recipe.id && recipe.id === selectedRecipe.id) || recipe.name === selectedRecipe.name
          ? { ...recipe, ...updatedRecipe }
          : recipe
      ));
      // Update the selected recipe to reflect changes immediately
      setSelectedRecipe(updatedRecipe);
    } catch (err) {
      console.error('Error updating recipe:', err);
      // Optional: Show an error message to user
    }
  };

  const handleReset = () => {
    setSelectedRecipe(null);
  };

  const handleRecipeSelect = async (recipe) => {
    if (recipe && recipe.name) {
      try {
        const user = auth.currentUser;
        if (!user) {
          console.error('No authenticated user');
          return;
        }

        // Use cached token instead of fetching new one each time
        const idToken = user.accessToken || await user.getIdToken(false);

        const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3000'}/api/recipes/${recipe.name}`, {
          headers: {
            'Authorization': `Bearer ${idToken}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch recipe details');
        }

        const data = await response.json();
        setSelectedRecipe(data);
      } catch (err) {
        console.error('Error fetching recipe details:', err);
      }
    } else {
      setSelectedRecipe(recipe);
    }
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
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 p-6 flex justify-center" style={{ zoom: '0.75' }}>
      <div className="w-full max-w-7xl">
        <div className="flex justify-center mb-4 relative">
          <h1 className="text-2xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Recipe Manager
          </h1>
          <button
            onClick={() => signOut(auth)}
            className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
            title="Sign Out"
          >
            <LogOut size={20} />
          </button>
        </div>
        <div className="flex flex-col gap-6">
          <div className="flex flex-row gap-6 items-stretch flex-wrap min-h-[calc(65vh-200px)]">
            {/* Left Panel */}
            <div className="flex-1 min-w-[400px] flex flex-col gap-4">
              {/* Recipe List - Extended with box */}
              <div className="border-2 border-blue-500 rounded-xl p-2 bg-cyan-300 flex-1 flex flex-col min-h-[350px]">
                <List
                  recipes={paginatedRecipes}
                  selectedRecipe={selectedRecipe}
                  onRecipeSelect={handleRecipeSelect}
                />
              </div>
            </div>

            {/* Right Panel - Details (to the right of List) with box */}
            <div className="flex-1 min-w-[400px] flex flex-col">
              <div className="border-2 border-blue-500 rounded-xl p-2 bg-cyan-300 h-full box-border flex flex-col">
                <Details
                  recipe={selectedRecipe}
                  onAdd={handleAdd}
                  onUpdate={handleUpdate}
                  onReset={handleReset}
                  canUpdate={canUpdate}
                />
              </div>
            </div>
          </div>

          {/* Search, Categories and Pagination at the bottom - spanning full width */}
          <div className="flex flex-col gap-4">
            {/* Search and Categories - Side by side with box - stretched to full width */}
            <div className="border-2 border-blue-500 rounded-xl p-2 bg-cyan-300 box-border w-full">
              <div className="flex flex-row gap-4 flex-wrap items-stretch">
                <div className="flex-1 min-w-[200px] flex box-border">
                  <Search onSearch={handleSearch} onFind={findRecipeIndex} />
                </div>
                <div className="flex-1 min-w-[200px] flex box-border">
                  <Categories
                    recipes={recipes}
                    selectedCategory={selectedCategory}
                    onCategorySelect={handleCategorySelect}
                  />
                </div>
              </div>
            </div>

            {/* Pagination */}
            <div className="flex flex-row items-center justify-center gap-3 p-4 bg-cyan-300 rounded-xl shadow-sm border border-gray-200 flex-wrap">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`flex items-center gap-1 px-4 py-2 text-white rounded-lg border-none whitespace-nowrap ${currentPage === 1
                  ? 'bg-gray-300 cursor-not-allowed opacity-60'
                  : 'bg-gradient-to-r from-blue-600 to-blue-700 cursor-pointer'
                  }`}
              >
                <ChevronLeft size={20} />
                Previous
              </button>
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700 whitespace-nowrap">
                <span>Page</span>
                <input
                  type="number"
                  min="1"
                  max={totalPages || 1}
                  value={currentPage}
                  onChange={(e) => handlePageChange(parseInt(e.target.value) || 1)}
                  className="w-16 px-2 py-1 text-center border border-gray-300 rounded-lg outline-none"
                />
                <span>of {totalPages || 1}</span>
              </div>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className={`flex items-center gap-1 px-4 py-2 text-white rounded-lg border-none whitespace-nowrap ${currentPage >= totalPages
                  ? 'bg-gray-300 cursor-not-allowed opacity-60'
                  : 'bg-gradient-to-r from-blue-600 to-blue-700 cursor-pointer'
                  }`}
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

