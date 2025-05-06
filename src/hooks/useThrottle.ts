// Similar to debounce but executes at regular intervals
import { useState, useEffect, useRef, useCallback } from "react";

/**
 * A hook that returns a throttled value that updates at most once per specified interval.
 * @template T The type of the value being throttled
 * @param {T} value - The value to throttle
 * @param {number} limit - The minimum time in milliseconds between updates
 * @returns {object} Object containing the throttled value and error state
 */
function useThrottle<T>(
  value: T,
  limit: number = 500
): {
  value: T;
  error: Error | null;
} {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const [error, setError] = useState<Error | null>(null);

  // Initialize ref with a safe value
  const lastRan = useRef<number>(0);
  const initialized = useRef<boolean>(false);

  useEffect(() => {
    // Safe initialization in effect instead of component body
    if (!initialized.current) {
      try {
        lastRan.current = Date.now();
        initialized.current = true;
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
        return; // Exit early if initialization fails
      }
    }

    if (error) return; // Skip effect if there's already an error

    try {
      const handler = setTimeout(() => {
        try {
          const elapsed = Date.now() - lastRan.current;
          const shouldUpdate = elapsed >= limit;

          if (shouldUpdate) {
            setThrottledValue(value);
            lastRan.current = Date.now();
          }
        } catch (err) {
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      }, Math.max(0, limit - (Date.now() - lastRan.current))); // Ensure non-negative timeout

      return () => {
        clearTimeout(handler);
      };
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    }
  }, [value, limit, error]);

  return {
    value: throttledValue,
    error,
  };
}

/**
 * A hook that creates a throttled function that executes at most once per specified interval.
 * @param {Function} fn - The function to throttle
 * @param {number} limit - The minimum time in milliseconds between function calls
 * @returns {Function} The throttled function
 */
export function useThrottleFn<T extends (...args: any[]) => any>(
  fn: T,
  limit: number = 500
): T {
  const lastRan = useRef<number>(0);
  const fnRef = useRef<T>(fn);

  // Keep reference to latest function
  useEffect(() => {
    fnRef.current = fn;
  }, [fn]);

  // Create stable throttled function
  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastRan.current >= limit) {
        lastRan.current = now;
        return fnRef.current(...args);
      }
    },
    [limit]
  ) as T;
}

export default useThrottle;
