import React, { useState, useEffect } from 'react';
import { GITHUB_USERS_DETAILS_URL } from '../constants/constants';

const RepositoryTable = ({ username }) => {
  const [repositories, setRepositories] = useState([]);

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

  return (
    <div>
      <h2>Repositories for {username}</h2>
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
          {repositories.map((repo) => (
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
