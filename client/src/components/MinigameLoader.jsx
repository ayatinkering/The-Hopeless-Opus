import React, { Suspense, useEffect, useCallback, useRef } from 'react';
import useMinigameSession from '../lib/useMinigameSession';
import API_BASE from '../lib/api_endpoint';

// Lazy-load minigame components to reduce bundle size
const M1 = React.lazy(() => import('../Minigames/M1'));
const M2 = React.lazy(() => import('../Minigames/M2'));
const M3 = React.lazy(() => import('../Minigames/M3'));
const M4 = React.lazy(() => import('../Minigames/M4'));
const M5 = React.lazy(() => import('../Minigames/M5'));
const M6 = React.lazy(() => import('../Minigames/M6'));
const M7 = React.lazy(() => import('../Minigames/M7'));
const M8 = React.lazy(() => import('../Minigames/M8'));
const M9A = React.lazy(() => import('../Minigames/M9A'));
const M9B = React.lazy(() => import('../Minigames/M9B'));
const M10 = React.lazy(() => import('../Minigames/M10'));
const M11 = React.lazy(() => import('../Minigames/M11'));
const M12 = React.lazy(() => import('../Minigames/M12'));
const M13 = React.lazy(() => import('../Minigames/M13'));
const M14 = React.lazy(() => import('../Minigames/M14'));
const M15 = React.lazy(() => import('../Minigames/M15'));

const MAP = {
  M1,
  M2,
  M3,
  M4,
  M5,
  M6,
  M7,
  M8,
  M9A,
  M9B,
  M10,
  M11,
  M12,
  M13,
  M14,
  M15,
};

export default function MinigameLoader({ id, config, onComplete }) {
  useEffect(() => { /* mount hook placeholder */ }, [id]);

  const { session, remainingSeconds, triesLeft, api } = useMinigameSession(id);

  // Centralized completion handler that understands tries and timer
  // and guards against duplicate finalization calls (idempotent)
  const finalizingRef = useRef(false);

  const handleComplete = useCallback(async (success) => {
    // If we've already finalized (success or final failure), ignore subsequent calls
    if (finalizingRef.current) return;
    try {
      if (success) {
        finalizingRef.current = true;
        // Complete session to compute and persist score
        await api.completeSession();
        // Attempt to claim reward (ignore errors to avoid blocking flow)
        try {
          const token = localStorage.getItem('token');
          await fetch(`${API_BASE}/minigame/session/claim-reward`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { Authorization: `Bearer ${token}` } : {})
            },
            body: JSON.stringify({ minigameId: id })
          });
        } catch (rewardErr) {
          // ignore reward errors
        }

        // Notify loader parent that the game finished successfully
        onComplete(true);
        return;
      }

      // FAILURE path: if the session indicates tries are available, decrement and continue
      if (typeof triesLeft === 'number' && triesLeft > 0) {
        try {
          await api.decrementTry();
          // refresh state (start a new attempt if backend restarted timer)
          await api.fetchState();
          // keep the minigame mounted so user can try again
          return;
        } catch (e) {
          // if decrement fails, fallthrough to ending the minigame
        }
      }

      // No tries left (or not a tries game) -> signal failure to parent to branch story
      finalizingRef.current = true;
      onComplete(false);
    } catch (e) {
      // In case of unexpected errors still signal completion to avoid locking UI
      // console.error('Error in handleComplete', e);
      onComplete(success);
    }
  }, [api, onComplete, id, triesLeft]);

  const Component = MAP[id];

  // Auto-handle backend timer expiry: when remainingSeconds reaches 0, treat as a failure
  useEffect(() => {
    if (!session) return;
    if (session.completed) return;
    if (remainingSeconds === 0) {
      // call the centralized failure handling
      handleComplete(false);
    }
  }, [remainingSeconds, session, handleComplete]);

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
        <div className="relative w-full h-full">
          <div className="minigame-content relative w-full h-full">
          {/* Dev/Test Success Toggle */}
          {/* <div className="absolute top-2 left-2 z-50 flex gap-2">
            <button
              className="px-3 py-1 rounded bg-green-600 text-white text-sm"
              onClick={() => handleComplete(true)}
            >Force Success</button>
            <button
              className="px-3 py-1 rounded bg-red-600 text-white text-sm"
              onClick={() => handleComplete(false)}
            >Force Fail</button>
          </div> */}
            <Component
              config={config}
              onComplete={handleComplete}
              session={session}
              sessionApi={api}
            />
          </div>
        </div>
      </Suspense>
    </div>
  );
}
