import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';
import { GITHUB_USERS_SEARCH_URL } from '../constants/constants';

const UserSearch = () => {
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async (username) => {
    const url = `${GITHUB_USERS_SEARCH_URL}?q=${username}`
    try {
      const response = await fetch(url);
      const data = await response.json();
      setSearchResults(data.items);
    } catch (error) {
      console.error('Error fetching user search results:', error);
    }
  };

  return (
    <div>
      <h2 className=''>User Search</h2>
      <SearchBar onSearch={handleSearch} />
      <ul>
        {searchResults.map((user) => (
          <li key={user.id}>
            <Link to={`/user/${user.login}`}>{user.login}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserSearch;
