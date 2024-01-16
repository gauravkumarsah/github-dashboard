import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  GITHUB_REPOS_URL,
  GITHUB_USERS_DETAILS_URL,
} from '../constants/constants';

const RepositoryTable = ({ username }) => {
  const [repositories, setRepositories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortType, setSortType] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [contributors, setContributors] = useState([]);

  useEffect(() => {
    const url = `${GITHUB_USERS_DETAILS_URL}${username}/repos`;
    const fetchRepositories = async () => {
      try {
        const response = await fetch(url);
        const data = await response.json();
        setRepositories(data);
      } catch (error) {
        console.error('Error fetching repositories:', error);
      }
    };

    if (username) {
      fetchRepositories();
    }
  }, [username]);

  useEffect(() => {
    const fetchContributors = async () => {
      if (selectedRepo) {
        const url = `${GITHUB_REPOS_URL}${username}/${selectedRepo}/contributors`;
        try {
          const response = await fetch(url);
          const data = await response.json();
          setContributors(data);
        } catch (error) {
          console.error('Error fetching contributors:', error);
        }
      }
    };

    fetchContributors();
  }, [username, selectedRepo]);

  const sortRepositories = (type) => {
    if (type === sortType) {
      setSortDirection((prevDirection) =>
        prevDirection === 'asc' ? 'desc' : 'asc'
      );
    } else {
      setSortType(type);
      setSortDirection('asc');
    }
  };

  const getSortedRepositories = () => {
    return [...repositories].sort((a, b) => {
      const factor = sortDirection === 'asc' ? 1 : -1;

      if (sortType === 'name') {
        return factor * a.name.localeCompare(b.name);
      } else if (sortType === 'stars') {
        return factor * (a.stargazers_count - b.stargazers_count);
      } else if (sortType === 'forks') {
        return factor * (a.forks_count - b.forks_count);
      } else if (sortType === 'issues') {
        return factor * (a.open_issues_count - b.open_issues_count);
      }

      return 0;
    });
  };

  const handleRepositoryClick = (repoName) => {
    setSelectedRepo(repoName);
  };

  const filteredRepositories = getSortedRepositories().filter((repo) =>
    repo.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gray-100 p-4">
      <h2 className="text-2xl font-bold mb-4">Repositories for {username}</h2>
      <div className="flex mb-4 gap-4">
        <input
          type="text"
          className="p-2 border border-gray-300 rounded-md focus:outline-none"
          placeholder="Search by repository name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 focus:outline-none"
          onClick={() => sortRepositories('name')}
        >
          Sort by Name
        </button>
        <button
          className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 focus:outline-none"
          onClick={() => sortRepositories('stars')}
        >
          Sort by Stars
        </button>
        <button
          className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 focus:outline-none"
          onClick={() => sortRepositories('forks')}
        >
          Sort by Forks
        </button>
        <button
          className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 focus:outline-none"
          onClick={() => sortRepositories('issues')}
        >
          Sort by Open Issues
        </button>
      </div>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-blue-500 text-white">
            <th className="p-2">Name</th>
            <th className="p-2">Description</th>
            <th className="p-2">Stars</th>
            <th className="p-2">Forks</th>
            <th className="p-2">Open Issues</th>
            <th className="p-2"></th>
          </tr>
        </thead>
        <tbody>
          {filteredRepositories.map((repo) => (
            <tr
              key={repo.id}
              className="hover:bg-gray-200 cursor-pointer"
              onClick={() => handleRepositoryClick(repo.name)}
            >
              <td className="p-2">{repo.name}</td>
              <td className="p-2">{repo.description}</td>
              <td className="p-2">{repo.stargazers_count}</td>
              <td className="p-2">{repo.forks_count}</td>
              <td className="p-2">{repo.open_issues_count}</td>
              <td className="p-2">
                <Link
                  to={`/${username}/${repo.name}`}
                  className="text-blue-500 hover:underline"
                >
                  Details
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedRepo && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">
            Contributors for {selectedRepo}
          </h3>
          <ul className="list-decimal ml-4">
            {contributors.map((contributor) => (
              <li key={contributor.id} className="mb-2">
                <strong>{contributor.login}</strong> - Contributions:{' '}
                {contributor.contributions}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default RepositoryTable;
