import React, { Suspense, useEffect } from 'react';

// Lazy-load minigame components to reduce bundle size
const M1 = React.lazy(() => import('../Minigames/M1'));
const M2 = React.lazy(() => import('../Minigames/M2'));
const M3 = React.lazy(() => import('../Minigames/M3'));
const M4 = React.lazy(() => import('../Minigames/M4'));
const M5 = React.lazy(() => import('../Minigames/M5'));
const M6 = React.lazy(() => import('../Minigames/M6'));
const M7 = React.lazy(() => import('../Minigames/M7'));

const MAP = {
  M1,
  M2,
  M3,
  M4,
  M5,
  M6,
  M7,
};

export default function MinigameLoader({ id, config, onComplete }) {
  useEffect(() => {
    console.log('[MinigameLoader] mount id=', id);
  }, [id]);

  const Component = MAP[id];

  if (!Component) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <div className="mb-4">Unknown minigame: {id}</div>
          <button
            className="px-4 py-2 rounded bg-red-500"
            onClick={() => onComplete(false)}
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen">
      <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-white">Loading {id}…</div>}>
        <Component config={config} onComplete={(success) => {
          console.log(`[MinigameLoader] ${id} onComplete ->`, success);
          try {
            onComplete(success);
          } catch (e) {
            console.error('Error in onComplete callback from MinigameLoader:', e);
          }
        }} />
      </Suspense>
    </div>
  );
}
