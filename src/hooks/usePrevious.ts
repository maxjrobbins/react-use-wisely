import { useRef, useEffect } from "react";

/**
 * Hook to track previous value of a variable
 * @template T - Type of the value to track
 * @param value - The value to track
 * @returns Object containing the previous value and error state
 */
const usePrevious = <T>(value: T) => {
  const ref = useRef<T | undefined>(undefined);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return {
    value: ref.current,
    error: null,
  };
};

export default usePrevious;
