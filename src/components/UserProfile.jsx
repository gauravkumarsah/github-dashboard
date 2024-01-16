import React from 'react';
import { Link, useParams } from 'react-router-dom';

import RepositoryTable from './RepositoryTable';

const UserProfile = () => {
  const { username } = useParams();

  return (
    <div className="bg-gray-100 min-h-screen  p-4">
      <Link to="/" className="flex items-center text-blue-500 pl-4">
        <span className="mb-2">&#8592;</span>
        <p className=" hover:underline">Back to Search</p>
      </Link>
      <div className="mt-4">
        <RepositoryTable username={username} />
      </div>
    </div>
  );
};

export default UserProfile;
