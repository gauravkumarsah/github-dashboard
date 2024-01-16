import React from 'react';
import { Link, useParams } from 'react-router-dom'; 

import RepositoryTable from './RepositoryTable';

const UserProfile = () => {
  const { username } = useParams(); 

  return (
    <div>
      <Link to="/">Back to Search</Link>
      <RepositoryTable username={username} />
    </div>
  );
};

export default UserProfile;
