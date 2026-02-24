import { useEffect, useRef, useCallback } from "react";

/**
 * Polls a callback every `intervalMs` milliseconds.
 * Stops automatically when `active` is false.
 */
export function usePolling(
  callback: () => void | Promise<void>,
  intervalMs: number,
  active: boolean = true
) {
  const savedCallback = useRef(callback);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  const stop = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!active) { stop(); return; }
    timerRef.current = setInterval(() => {
      savedCallback.current();
    }, intervalMs);
    return stop;
  }, [active, intervalMs, stop]);
}
