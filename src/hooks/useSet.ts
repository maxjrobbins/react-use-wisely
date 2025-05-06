import { useState, useCallback, useRef } from "react";

/**
 * Hook for managing Set data structures
 * @template T - Type of items in the Set
 * @param initialValue - Initial Set values
 * @returns A standardized object with set value and actions
 */
const useSet = <T = any>(
  initialValue: Iterable<T> = []
): {
  value: Set<T>;
  add: (item: T) => void;
  remove: (item: T) => void;
  clear: () => void;
  has: (item: T) => boolean;
  toggle: (item: T) => void;
  error: null;
} => {
  // Initialize the set state
  const [set, setSet] = useState<Set<T>>(new Set<T>(initialValue));

  // Use a ref to store the current set for the `has` method
  // This ensures we can access the latest set even in closure
  const setRef = useRef<Set<T>>(set);

  // Update ref whenever set changes
  setRef.current = set;

  const add = useCallback((item: T): void => {
    setSet((prevSet) => {
      const newSet = new Set(prevSet);
      newSet.add(item);
      return newSet;
    });
  }, []);

  const remove = useCallback((item: T): void => {
    setSet((prevSet) => {
      const newSet = new Set(prevSet);
      newSet.delete(item);
      return newSet;
    });
  }, []);

  const clear = useCallback((): void => {
    setSet(new Set<T>());
  }, []);

  // Return the current set value, not dependent on state closure
  const has = useCallback((item: T): boolean => {
    return setRef.current.has(item);
  }, []);

  const toggle = useCallback((item: T): void => {
    setSet((prevSet) => {
      const newSet = new Set(prevSet);
      if (newSet.has(item)) {
        newSet.delete(item);
      } else {
        newSet.add(item);
      }
      return newSet;
    });
  }, []);

  return {
    value: set,
    add,
    remove,
    clear,
    has,
    toggle,
    error: null,
  };
};

export default useSet;
