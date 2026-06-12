import React, { useId } from 'react';

const MOODS = {
  idle: { eyeY: 18, pupilY: 18, tentacle: 0 },
  curious: { eyeY: 17, pupilY: 19, tentacle: -3 },
  celebrate: { eyeY: 16, pupilY: 16, tentacle: 6 },
  wave: { eyeY: 17, pupilY: 17, tentacle: 8, wink: true },
  busy: { eyeY: 19, pupilY: 19, tentacle: -2, brows: true },
  chill: { eyeY: 18, pupilY: 18, tentacle: 2, smile: true },
  peek: { eyeY: 17, pupilY: 18, tentacle: 4, peek: true },
  swim: { eyeY: 16, pupilY: 16, tentacle: 10, swim: true },
  sleep: { eyeY: 20, pupilY: 20, tentacle: 0, sleep: true },
};

function OctoMascot({ mood = 'idle', size = 64, className = '' }) {
  const uid = useId().replace(/:/g, '');
  const m = MOODS[mood] ?? MOODS.idle;

  return (
    <svg
      className={`octo-mascot-svg ${className}`.trim()}
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`octo-body-${uid}`} x1="12" y1="8" x2="52" y2="48">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#7b5cff" />
        </linearGradient>
        <linearGradient id={`octo-glow-${uid}`} x1="32" y1="0" x2="32" y2="64">
          <stop offset="0%" stopColor="#c4b5fd" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#7b5cff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <ellipse cx="32" cy="52" rx="22" ry="6" fill={`url(#octo-glow-${uid})`} />
      <path
        d={`M18 38 Q14 ${42 + m.tentacle} 16 48 Q20 52 24 46`}
        stroke="#6a4de8"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d={`M28 40 Q24 ${44 + m.tentacle} 26 50 Q30 54 32 48`}
        stroke="#6a4de8"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d={`M36 40 Q40 ${44 + m.tentacle} 38 50 Q34 54 32 48`}
        stroke="#6a4de8"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d={`M46 38 Q50 ${42 + m.tentacle} 48 48 Q44 52 40 46`}
        stroke="#6a4de8"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      {m.swim && (
        <path
          d="M12 28 Q8 24 12 20"
          stroke="#8b6cff"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          opacity="0.6"
        />
      )}
      <circle cx="32" cy="24" r="18" fill={`url(#octo-body-${uid})`} />
      <circle cx="32" cy="24" r="18" stroke="#5a3ddb" strokeWidth="1.5" fill="none" opacity="0.5" />
      {m.sleep ? (
        <>
          <path d="M22 20 Q26 22 30 20" stroke="#1b0c33" strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M34 20 Q38 22 42 20" stroke="#1b0c33" strokeWidth="2" strokeLinecap="round" fill="none" />
        </>
      ) : (
        <>
          {m.wink ? (
            <>
              <ellipse cx="24" cy={m.eyeY} rx="4" ry="5" fill="#1b0c33" />
              <path d="M37 18 Q40 20 43 18" stroke="#1b0c33" strokeWidth="2" strokeLinecap="round" fill="none" />
              <circle cx="25" cy={m.pupilY} r="1.5" fill="#fff" />
            </>
          ) : (
            <>
              <ellipse cx="24" cy={m.eyeY} rx="4" ry="5" fill="#1b0c33" />
              <ellipse cx="40" cy={m.eyeY} rx="4" ry="5" fill="#1b0c33" />
              <circle cx="25" cy={m.pupilY} r="1.5" fill="#fff" />
              <circle cx="41" cy={m.pupilY} r="1.5" fill="#fff" />
            </>
          )}
        </>
      )}
      {m.brows && (
        <>
          <path d="M20 14 L28 16" stroke="#5a3ddb" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M36 16 L44 14" stroke="#5a3ddb" strokeWidth="1.5" strokeLinecap="round" />
        </>
      )}
      {(m.smile || mood === 'celebrate' || mood === 'chill') && (
        <path
          d="M26 30 Q32 34 38 30"
          stroke="#5a3ddb"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.7"
        />
      )}
      {mood === 'celebrate' && (
        <path
          d="M22 14 Q26 10 30 14"
          stroke="#fde68a"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
      )}
      {mood === 'curious' && (
        <ellipse cx="32" cy="30" rx="3" ry="2" fill="#5a3ddb" opacity="0.6" />
      )}
      {m.sleep && (
        <>
          <text x="46" y="14" fill="#8b7ef0" fontSize="8" fontWeight="700">z</text>
          <text x="52" y="10" fill="#a78bfa" fontSize="6" fontWeight="700">z</text>
        </>
      )}
    </svg>
  );
}

export default OctoMascot;
