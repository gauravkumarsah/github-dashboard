import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { GITHUB_REPOS_URL } from '../constants/constants';

const RepositoryDetail = () => {
  const { username, repoName } = useParams();
  const [repository, setRepository] = useState(null);
  const [readme, setReadme] = useState('');
  const [commits, setCommits] = useState([]);
  const [issues, setIssues] = useState([]);

  const fetchRepositoryData = async () => {
    try {
      const repositoryResponse = await fetch(
        `${GITHUB_REPOS_URL}${username}/${repoName}`
      );
      const repositoryData = await repositoryResponse.json();
      setRepository(repositoryData);

      const readmeResponse = await fetch(
        `${GITHUB_REPOS_URL}${username}/${repoName}/readme`
      );
      const readmeData = await readmeResponse.json();
      setReadme(atob(readmeData.content)); // Decode Base64 content

      const commitsResponse = await fetch(
        `${GITHUB_REPOS_URL}${username}/${repoName}/commits`
      );
      const commitsData = await commitsResponse.json();
      setCommits(commitsData);

      const issuesResponse = await fetch(
        `${GITHUB_REPOS_URL}${username}/${repoName}/issues`
      );
      const issuesData = await issuesResponse.json();
      setIssues(issuesData);
    } catch (error) {
      console.error('Error fetching repository details:', error);
    }
  };

  useEffect(() => {
    fetchRepositoryData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username, repoName]);

  if (!repository) {
    return (
      <div className="h-dvh flex items-center justify-center">
        <div className="text-center p-4 text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 p-4 h-dvh">
      <div className="mb-4">
        <Link
          to={`/user/${username}`}
          className="flex items-center text-blue-500"
        >
          <span className="mb-2">&#8592;</span>
          <p className=" hover:underline">Back to RepositoryTable</p>
        </Link>
      </div>
      <h2 className="text-2xl font-bold mb-4">{repository.name} Details</h2>

      <div className="mb-4">
        <h3 className="text-lg font-semibold">README</h3>
        <div>{readme}</div>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold">Recent Commits</h3>
        <ul className="list-decimal ml-4">
          {commits.map((commit) => (
            <li key={commit.sha}>{commit.commit.message}</li>
          ))}
        </ul>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold">Open Issues</h3>
        <ul className="list-decimal ml-4">
          {issues.map((issue) => (
            <li key={issue.id}>{issue.title}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RepositoryDetail;
