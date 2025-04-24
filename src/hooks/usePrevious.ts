import { useRef, useEffect } from "react";

/**
 * Hook to track previous value of a variable
 * @template T - Type of the value to track
 * @param value - The value to track
 * @returns The previous value
 */
const usePrevious = <T>(value: T): T | undefined => {
  const ref = useRef<T | undefined>(undefined);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
};

export default usePrevious;
