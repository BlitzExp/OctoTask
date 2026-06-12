import React, { useMemo } from 'react';
import logo from '../../assets/logoSymbol.svg';
import { OCTOBUDDY_IMAGES, pickRandomImageKeys } from './OctoBuddyDecor';
import OctoMascot from './OctoMascot';

const COPY = {
  login: {
    eyebrow: 'Your friendly task companion',
    subtitle:
      'OctoBuddy keeps your sprints organized, your team aligned, and your tentacles on every deadline.',
    features: [
      'Drag tasks across your board like a pro',
      'See who’s swimming in work — and who’s cruising',
      'Analytics that actually make sense',
    ],
    quote: '"Eight arms, zero missed deadlines."',
  },
  register: {
    eyebrow: 'Join the pod',
    subtitle:
      'Create your account and dive into a workspace built for teams who ship together.',
    features: [
      'Set up in minutes — no complicated onboarding',
      'Pick your role: captain or crew',
      'Jump straight into boards and analytics',
    ],
    quote: '"Every great sprint starts with one brave octopus."',
  },
};

function AuthBrandPanel({ variant = 'login' }) {
  const content = COPY[variant] ?? COPY.login;
  const stickers = useMemo(() => pickRandomImageKeys(3), []);

  return (
    <aside className="auth-brand-panel octobuddy-brand-panel" aria-label="OctoBuddy">
      <div className="auth-brand-stickers" aria-hidden="true">
        <img src={OCTOBUDDY_IMAGES[stickers[0] ?? 'party']} alt="" className="auth-brand-sticker auth-brand-sticker--party" />
        <img src={OCTOBUDDY_IMAGES[stickers[1] ?? 'analytics']} alt="" className="auth-brand-sticker auth-brand-sticker--analytics" />
        <img src={OCTOBUDDY_IMAGES[stickers[2] ?? 'swim']} alt="" className="auth-brand-sticker auth-brand-sticker--swim" />
      </div>
      <div className="auth-brand-glow auth-brand-glow--primary" aria-hidden="true" />
      <div className="auth-brand-glow auth-brand-glow--secondary" aria-hidden="true" />
      <div className="octobuddy-tentacle-accent" aria-hidden="true" />
      <div className="obd obd--svg" style={{ position: 'absolute', top: '6%', left: '4%', width: 40, height: 40, opacity: 0.5 }} aria-hidden="true">
        <OctoMascot mood="peek" size={40} />
      </div>
      <div className="auth-brand-panel__inner">
        <div className="auth-brand-logo-wrap octobuddy-mascot">
          <img src={logo} alt="" className="brand-icon" width={72} height={52} />
        </div>
        <p className="auth-brand-eyebrow">{content.eyebrow}</p>
        <h1 className="auth-brand-heading octobuddy-heading">
          <span className="brand-text">Octo</span>
          <span className="brand-text2 brand-text-buddy">Buddy</span>
        </h1>
        <p className="brand-subtitle">{content.subtitle}</p>
        <ul className="auth-brand-features">
          {content.features.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="auth-brand-quote">{content.quote}</p>
      </div>
    </aside>
  );
}

export default AuthBrandPanel;
