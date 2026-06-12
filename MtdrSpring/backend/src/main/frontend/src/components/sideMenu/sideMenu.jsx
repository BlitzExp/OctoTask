import React from 'react';
import { FaHome, FaFile, FaChartBar, FaBell, FaUsers, FaUser } from 'react-icons/fa';
import './sideMenu.css';
import OctoBuddyDecor from '../brand/OctoBuddyDecor';
import { formatRole } from '../../utils/roles';

function SideMenu({ children, currentView, onNavigate, user }) {
  const navItems = [
    { id: 'home', icon: FaHome, label: 'Home' },
    { id: 'taskDashboard', icon: FaFile, label: 'Board' },
    { id: 'analytics', icon: FaChartBar, label: 'Analytics' },
    { id: 'notifications', icon: FaBell, label: 'Alerts' },
    { id: 'team', icon: FaUsers, label: 'Pod' },
    { id: 'profile', icon: FaUser, label: 'Profile' },
  ];

  const initial = (user?.username || '?').charAt(0).toUpperCase();

  return (
    <div className="shell-layout">
      <nav className="side-menu shell-rail" aria-label="Primary">
        <OctoBuddyDecor variant="rail" />
        <div className="shell-rail__brand">
          <div className="shell-rail__logo" aria-hidden="true" />
          <div className="shell-rail__brand-text">
            <span className="shell-rail__brand-name">
              Octo<span>Buddy</span>
            </span>
            <span className="shell-rail__brand-tag">Your task pal</span>
          </div>
        </div>
        <div className="shell-rail__nav">
          {navItems.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              type="button"
              className={currentView === id ? 'item-container-selected' : 'item-container'}
              onClick={() => onNavigate(id)}
            >
              <Icon className="nav-icon" size={18} />
              <span className={currentView === id ? 'item-text-selected' : 'item-text'}>{label}</span>
            </button>
          ))}
        </div>
        {user && (
          <div className="shell-rail__footer">
            <div className="shell-rail__user" title={user.username}>
              <div className="shell-rail__avatar" aria-hidden="true">
                {initial}
              </div>
              <div className="shell-rail__user-info">
                <span className="shell-rail__user-name">{user.username}</span>
                <span className="shell-rail__user-role">{formatRole(user.role)}</span>
              </div>
            </div>
          </div>
        )}
      </nav>
      <main className="page-content shell-main shell-main--enter" key={currentView}>
        {children}
      </main>
    </div>
  );
}

export default SideMenu;
