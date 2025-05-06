import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { LocalStorageError } from "./errors";

/**
 * Type for the setValue function returned by useLocalStorage
 * Similar to React's Dispatch<SetStateAction<T>> but guarantees the value is stored in localStorage
 */
export type SetValue<T> = Dispatch<SetStateAction<T>>;

/**
 * Hook result interface for useLocalStorage
 */
export interface UseLocalStorageResult<T> {
  value: T;
  setValue: SetValue<T>;
  error: LocalStorageError | null;
  isSupported: boolean;
}

/**
 * Hook for managing localStorage values
 * @param key - The localStorage key
 * @param initialValue - The initial value
 * @returns - Object containing the stored value, setter function, error state, and feature support flag
 */
function useLocalStorage<T>(
  key: string,
  initialValue: T
): UseLocalStorageResult<T> {
  // Check if localStorage is supported
  const isSupported = typeof window !== "undefined" && !!window.localStorage;

  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (!isSupported) {
      return initialValue;
    }

    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      const errorMessage =
        error instanceof Error
          ? `Failed to parse localStorage item "${key}": ${error.message}`
          : `Unknown error parsing localStorage item "${key}"`;
      console.error(new LocalStorageError(errorMessage, error));
      return initialValue;
    }
  });

  // Add error state
  const [error, setError] = useState<LocalStorageError | null>(null);

  // Return a wrapped version of useState's setter function that
  // persists the new value to localStorage.
  const setValue: SetValue<T> = (value) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Clear any previous errors
      setError(null);

      // Save to local storage
      if (isSupported) {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      const localStorageError = new LocalStorageError(
        `Failed to store value in localStorage for key "${key}"`,
        error,
        { key, valueType: typeof value }
      );
      console.error(localStorageError);
      setError(localStorageError);

      // Still update the in-memory state even if localStorage fails
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
      } catch (stateError) {
        console.error("Failed to update state:", stateError);
      }
    }
  };

  // Listen for changes to this localStorage key in other tabs/windows
  useEffect(() => {
    if (!isSupported) {
      return;
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue));
          setError(null);
        } catch (error) {
          const parseError = new LocalStorageError(
            `Failed to parse localStorage change for key "${key}"`,
            error,
            { key, newValue: e.newValue }
          );
          console.error(parseError);
          setError(parseError);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [key, isSupported]);

  return {
    value: storedValue,
    setValue,
    error,
    isSupported,
  };
}

export default useLocalStorage;
