"use client";

import { useCallback, useSyncExternalStore } from "react";

// Per-viewer UI preference in localStorage. Server render and the first client
// render use the fallback, so the prerendered HTML never depends on storage.
const EVENT = "stotram:preference";

function read(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(EVENT, onChange);
  };
}

export function usePreference<T extends string>(
  key: string,
  fallback: T,
  allowed: readonly T[],
): [T, (value: T) => void] {
  const value = useSyncExternalStore(
    subscribe,
    () => {
      const stored = read(key);
      return allowed.includes(stored as T) ? (stored as T) : fallback;
    },
    () => fallback,
  );

  const set = useCallback(
    (next: T) => {
      try {
        window.localStorage.setItem(key, next);
      } catch {
        // Storage unavailable (private mode): preference just won't persist.
      }
      window.dispatchEvent(new Event(EVENT));
    },
    [key],
  );

  return [value, set];
}
