import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { GITHUB_REPOS_URL } from '../constants/constants';

const RepositoryDetail = () => {
  const { username, repoName } = useParams();
  const [repository, setRepository] = useState(null);
  const [readme, setReadme] = useState('');
  const [commits, setCommits] = useState([]);
  const [issues, setIssues] = useState([]);

  console.log(username, repoName);
  const fetchRepositoryData = async () => {
    try {
      // Fetch repository details
      const repositoryResponse = await fetch(
        `${GITHUB_REPOS_URL}${username}/${repoName}`
      );
      const repositoryData = await repositoryResponse.json();
      setRepository(repositoryData);

      // Fetch README file
      const readmeResponse = await fetch(
        `${GITHUB_REPOS_URL}${username}/${repoName}/readme`
      );
      const readmeData = await readmeResponse.json();
      setReadme(atob(readmeData.content)); // Decode Base64 content

      // Fetch recent commits
      const commitsResponse = await fetch(
        `${GITHUB_REPOS_URL}${username}/${repoName}/commits`
      );
      const commitsData = await commitsResponse.json();
      setCommits(commitsData);

      // Fetch open issues
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
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div>
        <Link to={`/user/${username}`}>Back to RepositoryTable</Link>
      </div>
      <h2>{repository.name} Details</h2>
      <div>
        <h3>README</h3>
        <div dangerouslySetInnerHTML={{ __html: readme }}></div>
      </div>
      <div>
        <h3>Recent Commits</h3>
        <ul>
          {commits.map((commit) => (
            <li key={commit.sha}>{commit.commit.message}</li>
          ))}
        </ul>
      </div>
      <div>
        <h3>Open Issues</h3>
        <ul>
          {issues.map((issue) => (
            <li key={issue.id}>{issue.title}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RepositoryDetail;
