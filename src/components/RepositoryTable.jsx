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
        <button onClick={() => sortRepositories('issues')}>
          Sort by Open Issues
        </button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Stars</th>
            <th>Forks</th>
            <th>Open Issues</th>
          </tr>
        </thead>
        <tbody>
          {filteredRepositories.map((repo) => (
            <tr key={repo.id} onClick={() => handleRepositoryClick(repo.name)}>
              <td>{repo.name}</td>
              <td>{repo.description}</td>
              <td>{repo.stargazers_count}</td>
              <td>{repo.forks_count}</td>
              <td>{repo.open_issues_count}</td>
              <td>
                <Link to={`/${username}/${repo.name}`}>Details</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedRepo && (
        <div>
          <h3>Contributors for {selectedRepo}</h3>
          <ul>
            {contributors.map((contributor) => (
              <li key={contributor.id}>
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
