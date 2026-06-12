import React, { useMemo } from 'react';
import OctoMascot from './OctoMascot';

const PUBLIC = process.env.PUBLIC_URL || '';

export const OCTOBUDDY_IMAGES = {
  wave: `${PUBLIC}/assets/octobuddy/octobuddy-wave.png`,
  tasks: `${PUBLIC}/assets/octobuddy/octobuddy-tasks.png`,
  analytics: `${PUBLIC}/assets/octobuddy/octobuddy-analytics.png`,
  peek: `${PUBLIC}/assets/octobuddy/octobuddy-peek.png`,
  sleep: `${PUBLIC}/assets/octobuddy/octobuddy-sleep.png`,
  party: `${PUBLIC}/assets/octobuddy/octobuddy-party.png`,
  home: `${PUBLIC}/assets/octobuddy/octobuddy-home.png`,
  pod: `${PUBLIC}/assets/octobuddy/octobuddy-pod.png`,
  alerts: `${PUBLIC}/assets/octobuddy/octobuddy-alerts.png`,
  profile: `${PUBLIC}/assets/octobuddy/octobuddy-profile.png`,
  coffee: `${PUBLIC}/assets/octobuddy/octobuddy-coffee.png`,
  laptop: `${PUBLIC}/assets/octobuddy/octobuddy-laptop.png`,
  swim: `${PUBLIC}/assets/octobuddy/octobuddy-swim.png`,
  thumbsup: `${PUBLIC}/assets/octobuddy/octobuddy-thumbsup.png`,
};

/** All image keys — handy for random picks elsewhere */
export const OCTOBUDDY_IMAGE_KEYS = Object.keys(OCTOBUDDY_IMAGES);

const IMG = (src) => ({ type: 'img', src });
const SVG = (mood) => ({ type: 'svg', mood });

const CONTENT_POOLS = {
  auth: [
    IMG('peek'), IMG('wave'), IMG('sleep'), IMG('party'), IMG('swim'), IMG('coffee'),
    SVG('swim'), SVG('chill'), SVG('curious'), SVG('wave'),
  ],
  app: [
    IMG('peek'), IMG('party'), IMG('wave'), IMG('swim'), IMG('coffee'), IMG('thumbsup'),
    IMG('laptop'), IMG('home'), SVG('wave'), SVG('idle'), SVG('swim'), SVG('chill'),
  ],
  home: [
    IMG('home'), IMG('wave'), IMG('coffee'), IMG('thumbsup'), IMG('party'),
    SVG('wave'), SVG('celebrate'), SVG('chill'),
  ],
  pod: [
    IMG('pod'), IMG('party'), IMG('wave'), IMG('thumbsup'), IMG('peek'),
    SVG('chill'), SVG('celebrate'), SVG('wave'),
  ],
  profile: [
    IMG('profile'), IMG('peek'), IMG('thumbsup'), IMG('coffee'),
    SVG('curious'), SVG('chill'), SVG('wave'),
  ],
  alerts: [
    IMG('alerts'), IMG('peek'), IMG('tasks'), IMG('party'), IMG('sleep'),
    SVG('busy'), SVG('curious'), SVG('wave'),
  ],
  board: [
    IMG('tasks'), IMG('peek'), IMG('laptop'), IMG('coffee'), IMG('thumbsup'),
    SVG('busy'), SVG('celebrate'), SVG('chill'),
  ],
  analytics: [
    IMG('analytics'), IMG('party'), IMG('peek'), IMG('laptop'), IMG('swim'),
    SVG('curious'), SVG('swim'), SVG('celebrate'),
  ],
};

const SLOTS = {
  auth: [
    { className: 'obd--auth-peek-tr', size: 88 },
    { className: 'obd--auth-wave-bl', size: 110 },
    { className: 'obd--auth-swim-tr', size: 56 },
    { className: 'obd--auth-chill-mr', size: 48 },
    { className: 'obd--auth-sleep-br', size: 72 },
    { className: 'obd--auth-curious-tl', size: 44 },
  ],
  app: [
    { className: 'obd--app-peek-br', size: 76 },
    { className: 'obd--app-wave-tl', size: 52 },
    { className: 'obd--app-party-tr', size: 64 },
    { className: 'obd--app-idle-bl', size: 40 },
    { className: 'obd--app-swim-mr', size: 48 },
    { className: 'obd--app-wave-mid', size: 56 },
  ],
  home: [
    { className: 'obd--home-hero-tr', size: 92 },
    { className: 'obd--home-wave-bl', size: 68 },
    { className: 'obd--home-coffee-mr', size: 52 },
    { className: 'obd--home-party-br', size: 60 },
    { className: 'obd--home-swim-tl', size: 44 },
  ],
  pod: [
    { className: 'obd--pod-hero-tr', size: 96 },
    { className: 'obd--pod-wave-bl', size: 64 },
    { className: 'obd--pod-thumbs-mr', size: 56 },
    { className: 'obd--pod-peek-br', size: 72 },
    { className: 'obd--pod-chill-tl', size: 44 },
  ],
  profile: [
    { className: 'obd--profile-hero-tr', size: 88 },
    { className: 'obd--profile-peek-bl', size: 68 },
    { className: 'obd--profile-coffee-mr', size: 52 },
    { className: 'obd--profile-wave-tl', size: 48 },
  ],
  alerts: [
    { className: 'obd--alerts-hero-tr', size: 90 },
    { className: 'obd--alerts-peek-bl', size: 70 },
    { className: 'obd--alerts-busy-mr', size: 48 },
    { className: 'obd--alerts-party-br', size: 58 },
    { className: 'obd--alerts-curious-tl', size: 44 },
  ],
  board: [
    { className: 'obd--board-tasks-tr', size: 96 },
    { className: 'obd--board-busy-tl', size: 48 },
    { className: 'obd--board-celebrate-br', size: 44 },
    { className: 'obd--board-peek-bl', size: 68 },
    { className: 'obd--board-chill-mr', size: 40 },
  ],
  analytics: [
    { className: 'obd--analytics-hero-tr', size: 100 },
    { className: 'obd--analytics-curious-tl', size: 52 },
    { className: 'obd--analytics-party-bl', size: 72 },
    { className: 'obd--analytics-swim-br', size: 44 },
  ],
  rail: [{ className: 'obd--rail-footer-wave', size: 26, mood: 'wave', type: 'svg' }],
  header: [{ className: 'obd--header-idle', size: 28, mood: 'idle', type: 'svg' }],
};

const FIXED_SCENES = {
  rail: SLOTS.rail,
  header: SLOTS.header,
};

function shuffleArray(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function buildDynamicScene(variant) {
  const slots = SLOTS[variant];
  const pool = CONTENT_POOLS[variant];
  if (!slots || !pool) return SLOTS.app ? buildDynamicScene('app') : [];

  const shuffled = shuffleArray(pool);
  const used = new Set();

  return slots.map((slot, index) => {
    let pick = shuffled[index % shuffled.length];
    let guard = 0;
    while (used.has(`${pick.type}-${pick.src ?? pick.mood}`) && guard < pool.length) {
      pick = shuffled[(index + guard) % shuffled.length];
      guard += 1;
    }
    used.add(`${pick.type}-${pick.src ?? pick.mood}`);
    return { ...pick, className: slot.className, size: slot.size };
  });
}

/** Pick N random image keys (for empty states, auth stickers, etc.) */
export function pickRandomImageKeys(count = 2, exclude = []) {
  const available = OCTOBUDDY_IMAGE_KEYS.filter((k) => !exclude.includes(k));
  return shuffleArray(available).slice(0, Math.min(count, available.length));
}

function DecorItem({ item }) {
  if (item.type === 'img') {
    const src = OCTOBUDDY_IMAGES[item.src];
    if (!src) return null;
    return (
      <img
        src={src}
        alt=""
        className={`obd obd--img ${item.className}`}
        style={{ width: item.size, height: item.size }}
        aria-hidden="true"
        draggable={false}
      />
    );
  }
  return (
    <div className={`obd obd--svg ${item.className}`} style={{ width: item.size, height: item.size }}>
      <OctoMascot mood={item.mood} size={item.size} />
    </div>
  );
}

function OctoBuddyDecor({ variant = 'app', className = '', dynamic = true }) {
  const items = useMemo(() => {
    if (!dynamic && FIXED_SCENES[variant]) return FIXED_SCENES[variant];
    if (FIXED_SCENES[variant]) return FIXED_SCENES[variant];
    return buildDynamicScene(variant);
  }, [variant, dynamic]);

  return (
    <div className={`octobuddy-decor octobuddy-decor--${variant} ${className}`.trim()} aria-hidden="true">
      <div className="octobuddy-decor__bubbles">
        <span className="obd-bubble obd-bubble--1" />
        <span className="obd-bubble obd-bubble--2" />
        <span className="obd-bubble obd-bubble--3" />
        <span className="obd-bubble obd-bubble--4" />
        <span className="obd-bubble obd-bubble--5" />
        <span className="obd-bubble obd-bubble--6" />
      </div>
      {items.map((item) => (
        <DecorItem key={`${variant}-${item.className}-${item.src ?? item.mood}`} item={item} />
      ))}
    </div>
  );
}

export default OctoBuddyDecor;
