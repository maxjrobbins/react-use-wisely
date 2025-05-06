import { useEffect, useRef, useCallback } from "react";

/**
 * Hook for safely managing setTimeout in a React component
 * @param {Function} callback - Function to call after the timeout
 * @param {number | null} delay - Delay in milliseconds. Pass null to disable the timeout.
 * @returns {Object} Object containing timeout controls and state
 */
const useTimeout = (
  callback: () => void,
  delay: number | null
): {
  reset: () => void;
  clear: () => void;
} => {
  const callbackRef = useRef<() => void>(callback);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Remember the latest callback
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Set up the timeout
  useEffect(() => {
    // Don't schedule if no delay is specified
    if (delay === null) {
      return;
    }

    timeoutRef.current = setTimeout(() => {
      callbackRef.current();
    }, delay);

    // Cleanup on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [delay]);

  // Reset the timeout
  const reset = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (delay !== null) {
      timeoutRef.current = setTimeout(() => callbackRef.current(), delay);
    }
  }, [delay]);

  // Clear the timeout
  const clear = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }
  }, []);

  return { reset, clear };
};

export default useTimeout;
