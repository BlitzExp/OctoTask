import React from 'react';
import OctoMascot from '../brand/OctoMascot';
import OctoBuddyDecor from '../brand/OctoBuddyDecor';
import './OctoPage.css';

function OctoPage({
  user,
  title,
  subtitle,
  greeting,
  mood = 'idle',
  decorVariant,
  children,
}) {
  const lead = greeting ?? (user?.username ? `Hey ${user.username}` : 'Hey there');

  return (
    <div className="octo-page">
      {decorVariant && <OctoBuddyDecor variant={decorVariant} />}
      <header className="octo-page__header">
        <div className="octo-page__header-text">
          <p className="octobuddy-page-greeting">{lead}</p>
          <h1 className="octo-page__title">{title}</h1>
          {subtitle && <p className="octo-page__subtitle">{subtitle}</p>}
        </div>
        <div className="octo-page__header-mascot" aria-hidden="true">
          <OctoMascot mood={mood} size={56} />
        </div>
      </header>
      <div className="octo-page__body">{children}</div>
    </div>
  );
}

export default OctoPage;
