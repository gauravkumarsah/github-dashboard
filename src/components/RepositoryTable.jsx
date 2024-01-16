import React, { useState, useEffect } from 'react';
import { GITHUB_USERS_DETAILS_URL } from '../constants/constants';

const RepositoryTable = ({ username }) => {
  const [repositories, setRepositories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortType, setSortType] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');

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

  const sortRepositories = (type) => {
    if (type === sortType) {
      setSortDirection((prevDirection) => (prevDirection === 'asc' ? 'desc' : 'asc'));
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

  const filteredRepositories = getSortedRepositories().filter((repo) =>
    repo.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h2>Repositories for {username}</h2>
      <div>
        <input
          type="text"
          placeholder="Search by repository name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={() => sortRepositories('name')}>Sort by Name</button>
        <button onClick={() => sortRepositories('stars')}>Sort by Stars</button>
        <button onClick={() => sortRepositories('forks')}>Sort by Forks</button>
        <button onClick={() => sortRepositories('issues')}>Sort by Open Issues</button>
      </div>
      <table>
        <tbody>
          {filteredRepositories.map((repo) => (
            <tr key={repo.id}>
              <td>{repo.name}</td>
              <td>{repo.description}</td>
              <td>{repo.stargazers_count}</td>
              <td>{repo.forks_count}</td>
              <td>{repo.open_issues_count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RepositoryTable;
