import React from 'react';
import './Background.css';
import OctoBuddyDecor from '../brand/OctoBuddyDecor';

function Background({ children, isAuthenticated }) {
  const theme = isAuthenticated ? 'app-light' : 'auth-dark';

  return (
    <div className="background-wrapper" data-theme={theme}>
      <OctoBuddyDecor variant={isAuthenticated ? 'app' : 'auth'} />
      <div className="background-content">{children}</div>
    </div>
  );
}

export default Background;
