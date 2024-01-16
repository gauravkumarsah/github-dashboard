import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserSearch from './components/UserSearch';
import UserProfile from './components/UserProfile';
import RepositoryDetail from './components/RepositoryDetail';

function App() {
  return (
    <Router>
      <div className="">
        <Routes>
          <Route path="/" element={<UserSearch />} />
          <Route path="/user/:username" element={<UserProfile />} />
          <Route path="/:username/:repoName" element={<RepositoryDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
