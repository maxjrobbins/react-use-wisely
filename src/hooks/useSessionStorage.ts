import { useState, useEffect, useCallback } from "react";
import { LocalStorageError } from "./errors";

type SetValue<T> = (value: T | ((prevValue: T) => T)) => void;

/**
 * Hook that manages a value in sessionStorage
 * @template T Type of the stored value
 * @param {string} key - The key to store the value under in sessionStorage
 * @param {T} initialValue - Initial value if no value is stored
 * @returns {[T, SetValue<T>, LocalStorageError | null]} Stored value, setter, and error if any
 */
function useSessionStorage<T>(
  key: string,
  initialValue: T
): [T, SetValue<T>, LocalStorageError | null] {
  // Check for sessionStorage availability
  const isSessionStorageAvailable = useCallback(() => {
    try {
      const testKey = "__storage_test__";
      window.sessionStorage.setItem(testKey, "true");
      window.sessionStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  }, []);

  // State to store the error
  const [error, setError] = useState<LocalStorageError | null>(null);

  // Get from sessionStorage on init
  const readStoredValue = useCallback((): T => {
    // SSR check
    if (typeof window === "undefined") {
      return initialValue;
    }

    // Check if sessionStorage is available
    if (!isSessionStorageAvailable()) {
      setError(
        new LocalStorageError("sessionStorage is not available", null, {
          key,
        })
      );
      return initialValue;
    }

    try {
      const item = window.sessionStorage.getItem(key);
      // Parse stored json or return initialValue if null
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (e) {
      console.warn(`Error reading sessionStorage key "${key}":`, e);
      setError(
        new LocalStorageError("Error reading from sessionStorage", e, {
          key,
          action: "read",
        })
      );
      return initialValue;
    }
  }, [initialValue, isSessionStorageAvailable, key]);

  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(readStoredValue);

  // Return a wrapped version of useState's setter function that persists
  // the new value to sessionStorage
  const setValue = useCallback(
    (value: T | ((prevValue: T) => T)) => {
      // SSR check
      if (typeof window === "undefined") {
        console.warn(
          `Attempted to set sessionStorage key "${key}" during SSR. This is a no-op.`
        );
        return;
      }

      try {
        // Allow value to be a function for same API as useState
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        // Save state
        setStoredValue(valueToStore);
        // Save to sessionStorage
        window.sessionStorage.setItem(key, JSON.stringify(valueToStore));
        // Clear any previous errors
        setError(null);
      } catch (e) {
        console.warn(`Error writing to sessionStorage key "${key}":`, e);
        setError(
          new LocalStorageError("Error writing to sessionStorage", e, {
            key,
            action: "write",
          })
        );
      }
    },
    [key, storedValue]
  );

  // Listen for changes to the sessionStorage
  useEffect(() => {
    // SSR check
    if (typeof window === "undefined") {
      return;
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.storageArea === sessionStorage && e.key === key) {
        try {
          setStoredValue(e.newValue ? JSON.parse(e.newValue) : initialValue);
        } catch (error) {
          console.warn(
            `Error parsing sessionStorage value for key "${key}":`,
            error
          );
          setError(
            new LocalStorageError("Error parsing sessionStorage value", error, {
              key,
              action: "sync",
            })
          );
        }
      }
    };

    // Listen for storage events in this window
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [key, initialValue]);

  return [storedValue, setValue, error];
}

export default useSessionStorage;
