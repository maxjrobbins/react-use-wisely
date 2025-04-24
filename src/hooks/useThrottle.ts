// Similar to debounce but executes at regular intervals
import { useState, useEffect, useRef } from "react";

/**
 * A hook that returns a throttled value that updates at most once per specified interval.
 * @template T The type of the value being throttled
 * @param {T} value - The value to throttle
 * @param {number} limit - The minimum time in milliseconds between updates
 * @returns {T} The throttled value
 */
function useThrottle<T>(value: T, limit: number = 500): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastRan = useRef<number>(Date.now());

  useEffect(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastRan.current >= limit) {
        setThrottledValue(value);
        lastRan.current = Date.now();
      }
    }, limit - (Date.now() - lastRan.current));

    return () => {
      clearTimeout(handler);
    };
  }, [value, limit]);

  return throttledValue;
}

export default useThrottle;
