import { useState, useEffect } from "react";

/**
 * Options for the useDebounce hook
 */
export interface DebounceOptions {
  /**
   * The delay in milliseconds
   * @default 500
   */
  delay?: number;
}

/**
 * Hook result for debounce operations
 */
export interface DebounceResult<T> {
  // State
  value: T;
  // Error handling
  error: null; // Debounce doesn't typically produce errors
}

/**
 * Hook for debouncing value changes
 * @param value - The value to debounce
 * @param options - Configuration options
 * @returns Object with debounced value
 */
const useDebounce = <T>(
  value: T,
  options: DebounceOptions = {}
): DebounceResult<T> => {
  const { delay = 500 } = options;
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set debouncedValue to value (passed in) after the specified delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Return a cleanup function that will be called every time
    // useEffect is re-called. useEffect will only be re-called
    // if value or delay changes.
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return {
    // State
    value: debouncedValue,
    // Error handling
    error: null,
  };
};

export default useDebounce;
