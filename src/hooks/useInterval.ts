import { useEffect, useRef, useCallback } from "react";

/**
 * Hook for safely managing setInterval in a React component
 * @param {Function} callback - Function to call on each interval
 * @param {number} delay - Delay in milliseconds between each interval. Pass null to pause.
 * @returns {Object} - Controls for the interval
 */
const useInterval = (
  callback: () => void,
  delay: number | null
): { reset: () => void; clear: () => void } => {
  const callbackRef = useRef<() => void>(callback);
  const intervalRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Remember the latest callback
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Set up the interval
  useEffect(() => {
    // Don't schedule if no delay is specified
    if (delay === null) {
      return;
    }

    const tick = () => {
      callbackRef.current();
    };

    intervalRef.current = setInterval(tick, delay);

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [delay]);

  // Reset the interval
  const reset = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    if (delay !== null) {
      intervalRef.current = setInterval(() => callbackRef.current(), delay);
    }
  }, [delay]);

  // Clear the interval
  const clear = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = undefined;
    }
  }, []);

  return { reset, clear };
};

export default useInterval;
