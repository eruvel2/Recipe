import React, { useState } from 'react';
import { Search as SearchIcon } from 'lucide-react';

function Search({ onSearch, onFind }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onFind(searchTerm);
    }
  };

  return (
    <div style={{ backgroundColor: 'white', borderRadius: '4px', padding: '16px', height: '100%', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
        <div style={{ padding: '6px', backgroundColor: '#dbeafe', borderRadius: '6px' }}>
          <SearchIcon size={16} style={{ color: '#2563eb' }} />
        </div>
        <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#374151', margin: 0 }}>Search</h3>
      </div>
      <div style={{ display: 'flex', gap: '8px', flex: '1', alignItems: 'flex-end' }}>
        <input
          type="text"
          value={searchTerm}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          placeholder="Search recipes..."
          style={{
            flex: 1,
            padding: '10px 16px',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            fontSize: '14px',
            outline: 'none'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#3b82f6';
            e.target.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.25)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#d1d5db';
            e.target.style.boxShadow = 'none';
          }}
        />
        <button 
          onClick={() => onFind(searchTerm)} 
          style={{
            padding: '10px 20px',
            background: 'linear-gradient(to right, #2563eb, #1d4ed8)',
            color: 'white',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontWeight: '600',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            whiteSpace: 'nowrap'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'linear-gradient(to right, #1d4ed8, #1e40af)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'linear-gradient(to right, #2563eb, #1d4ed8)';
          }}
        >
          Find
        </button>
      </div>
    </div>
  );
}

export default Search;

