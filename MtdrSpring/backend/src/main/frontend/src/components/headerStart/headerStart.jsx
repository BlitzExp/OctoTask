import React from 'react';
import './headerStart.css';
import OctoMascot from '../brand/OctoMascot';

function HeaderStart({ vista = 'register', onNavigate, user, onLogout }) {
  return (
    <header className="header-start shell-header" data-vista={vista} role="banner">
      <div className="shell-header__start">
        <div className="logoSymbol" aria-hidden="true" />
        <div className="obd obd--header-idle header-octobuddy" aria-hidden="true">
          <OctoMascot mood="wave" size={28} />
        </div>
        <h1 className="headerText">
          <span className="headerTextOcto">Octo</span>
          <span className="headerTextBuddy">Buddy</span>
        </h1>
      </div>
      <div className="shell-header__end">
        {user && onLogout && (
          <button type="button" className="headerButton headerButton--secondary" onClick={onLogout}>
            Sign out
          </button>
        )}
        {!user && vista === 'register' && (
          <button type="button" className="headerButton headerButton--secondary" onClick={() => onNavigate('login')}>
            Log in
          </button>
        )}
        {!user && vista === 'login' && (
          <button type="button" className="headerButton headerButton--secondary" onClick={() => onNavigate('register')}>
            Create account
          </button>
        )}
      </div>
    </header>
  );
}

export default HeaderStart;
