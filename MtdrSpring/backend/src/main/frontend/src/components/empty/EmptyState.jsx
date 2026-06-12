import React, { useMemo } from 'react';
import OctoMascot from '../brand/OctoMascot';
import { OCTOBUDDY_IMAGES, pickRandomImageKeys } from '../brand/OctoBuddyDecor';

function EmptyState({ title, description, mood = 'idle' }) {
  const orbitImages = useMemo(() => pickRandomImageKeys(2), []);

  return (
    <div className="octobuddy-empty-state">
      <div className="octobuddy-empty-cluster" aria-hidden="true">
        <div className="obd-cluster-orbit obd-cluster-orbit--1">
          <OctoMascot mood="wave" size={36} />
        </div>
        <div className="obd-cluster-orbit obd-cluster-orbit--2">
          <OctoMascot mood="chill" size={32} />
        </div>
        <div className="obd-cluster-orbit obd-cluster-orbit--3">
          <OctoMascot mood="curious" size={28} />
        </div>
        <div className="obd-cluster-orbit obd-cluster-orbit--4">
          <OctoMascot mood="celebrate" size={30} />
        </div>
        {orbitImages[0] && (
          <img src={OCTOBUDDY_IMAGES[orbitImages[0]]} alt="" className="obd-cluster-img obd-cluster-img--1" />
        )}
        {orbitImages[1] && (
          <img src={OCTOBUDDY_IMAGES[orbitImages[1]]} alt="" className="obd-cluster-img obd-cluster-img--2" />
        )}
        <div className="obd-cluster-center octobuddy-empty-state__mascot-wrap">
          <OctoMascot mood={mood} size={80} />
        </div>
      </div>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}

export default EmptyState;
