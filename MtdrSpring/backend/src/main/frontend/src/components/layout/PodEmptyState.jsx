import React from 'react';
import OctoMascot from '../brand/OctoMascot';

function PodEmptyState({ title = "You're not on a pod yet", message }) {
  return (
    <div className="octo-pod-empty">
      <OctoMascot mood="curious" size={56} />
      <h2>{title}</h2>
      <p>
        {message ||
          'Ask your manager for an invite, or register as a manager to start a new pod.'}
      </p>
    </div>
  );
}

export default PodEmptyState;
