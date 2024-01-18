import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';
import { GITHUB_USERS_SEARCH_URL } from '../constants/constants';

const UserSearch = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [onGoingRequest, setOngoingRequest] = useState(false);

  const handleSearch = async (username) => {
    const url = `${GITHUB_USERS_SEARCH_URL}?q=${username}`;

    // I am creating a new controller every click
    const controller = new AbortController();
    const signal = controller.signal;

    if (onGoingRequest) {
      setOngoingRequest(false)
      controller.abort();
    }
    try {
      setOngoingRequest(true)
      const response = await fetch(url, { signal });
      const data = await response.json();
      setSearchResults(data.items);
    } catch (error) {
      console.error('Error fetching user search results:', error);
    } finally {
       // I am Cleaning up the controller when the request is complete
      setOngoingRequest(false)
      controller.abort();
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-3xl py-12 shadow-md w-full md:w-1/2 lg:w-1/3  mx-4">
        <h2 className="text-3xl font-semibold mb-4 text-center mb-12">
          User Search
        </h2>
        <SearchBar onSearch={handleSearch} />
        <ul className="mt-4 space-y-2">
          {searchResults.map((user) => (
            <Link
              to={`/user/${user.login}`}
              className="flex items-center bg-white p-4 shadow-md rounded-md"
            >
              <li
                key={user.id}
                className="flex items-center text-blue-500 hover:underline"
              >
                <img
                  src={user.avatar_url}
                  alt={`${user.login}'s avatar`}
                  className="w-10 h-10 rounded-full mr-4"
                />
                {user.login}
              </li>
            </Link>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UserSearch;
