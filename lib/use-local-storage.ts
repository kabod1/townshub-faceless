"use client";

import { useState, useEffect, useCallback } from "react";

/**
 * SSR-safe localStorage hook.
 * Returns [value, setter, hydrated].
 * `hydrated` is false on the server / first render — use it to avoid flicker.
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [hydrated, setHydrated] = useState(false);
  const [stored, setStored] = useState<T>(initialValue);

  // Hydrate from localStorage once mounted
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw !== null) setStored(JSON.parse(raw));
    } catch {
      // corrupted or unavailable — fall back to initialValue
    }
    setHydrated(true);
  }, [key]);

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStored((prev) => {
        const next = typeof value === "function" ? (value as (p: T) => T)(prev) : value;
        try {
          window.localStorage.setItem(key, JSON.stringify(next));
        } catch {}
        return next;
      });
    },
    [key]
  );

  const remove = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
    } catch {}
    setStored(initialValue);
  }, [key, initialValue]);

  return [stored, setValue, hydrated, remove] as const;
}
