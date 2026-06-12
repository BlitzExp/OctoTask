import React, { useEffect } from 'react';
import OctoMascot from '../brand/OctoMascot';

function Toast({ message, mood = 'celebrate', onDismiss, duration = 3200 }) {
  useEffect(() => {
    const timer = window.setTimeout(() => onDismiss?.(), duration);
    return () => window.clearTimeout(timer);
  }, [duration, onDismiss]);

  return (
    <div className="octobuddy-toast" role="status" aria-live="polite">
      <OctoMascot mood={mood} size={36} />
      <span className="octobuddy-toast__message">{message}</span>
      <button
        type="button"
        className="octobuddy-toast__close"
        onClick={onDismiss}
        aria-label="Dismiss notification"
      >
        ✕
      </button>
    </div>
  );
}

export default Toast;
