import { useEffect, useRef, useCallback, useState } from "react";
import { BrowserAPIError } from "./errors";

interface IntervalResult {
  reset: () => void;
  clear: () => void;
  isSupported: boolean;
  error: Error | null;
}

/**
 * Hook for safely managing setInterval in a React component
 * @param {Function} callback - Function to call on each interval
 * @param {number} delay - Delay in milliseconds between each interval. Pass null to pause.
 * @returns {IntervalResult} - Controls and status for the interval
 */
const useInterval = (
  callback: () => void,
  delay: number | null
): IntervalResult => {
  const callbackRef = useRef<() => void>(callback);
  const intervalRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const [error, setError] = useState<Error | null>(null);
  const [isSupported] = useState(true); // setInterval is standard in JS environments

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

    try {
      const tick = () => {
        try {
          callbackRef.current();
        } catch (err) {
          setError(new BrowserAPIError("Error in interval callback", err));
          // Don't rethrow to keep interval running
        }
      };

      intervalRef.current = setInterval(tick, delay);

      // Cleanup on unmount
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    } catch (err) {
      setError(new BrowserAPIError("Failed to set interval", err));
    }
  }, [delay]);

  // Reset the interval
  const reset = useCallback(() => {
    try {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      if (delay !== null) {
        intervalRef.current = setInterval(() => {
          try {
            callbackRef.current();
          } catch (err) {
            setError(new BrowserAPIError("Error in interval callback", err));
            // Don't rethrow to keep interval running
          }
        }, delay);
      }
    } catch (err) {
      setError(new BrowserAPIError("Failed to reset interval", err));
    }
  }, [delay]);

  // Clear the interval
  const clear = useCallback(() => {
    try {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = undefined;
      }
    } catch (err) {
      setError(new BrowserAPIError("Failed to clear interval", err));
    }
  }, []);

  return {
    reset,
    clear,
    isSupported,
    error,
  };
};

export default useInterval;
