import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    onSearch(query);
  };

  return (
    <div className='flex  flex-col gap-4'>
      <input
        type="text"
        placeholder="Enter GitHub username"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none"
      />
      <button
        className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 focus:outline-none"
        onClick={handleSearch}
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;
