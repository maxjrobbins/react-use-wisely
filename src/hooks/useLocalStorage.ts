import { useState, useEffect, Dispatch, SetStateAction } from 'react';

/**
 * Type for the setValue function returned by useLocalStorage
 * Similar to React's Dispatch<SetStateAction<T>> but guarantees the value is stored in localStorage
 */
export type SetValue<T> = Dispatch<SetStateAction<T>>;

/**
 * Hook for managing localStorage values
 * @param key - The localStorage key
 * @param initialValue - The initial value
 * @returns - [storedValue, setValue] similar to useState
 */
function useLocalStorage<T>(key: string, initialValue: T): [T, SetValue<T>] {
    // State to store our value
    const [storedValue, setStoredValue] = useState<T>(() => {
        if (typeof window === 'undefined') {
            return initialValue;
        }

        try {
            // Get from local storage by key
            const item = window.localStorage.getItem(key);
            // Parse stored json or if none return initialValue
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            // If error also return initialValue
            console.error(error);
            return initialValue;
        }
    });

    // Return a wrapped version of useState's setter function that
    // persists the new value to localStorage.
    const setValue: SetValue<T> = (value) => {
        try {
            // Allow value to be a function so we have same API as useState
            const valueToStore =
                value instanceof Function ? value(storedValue) : value;
            // Save state
            setStoredValue(valueToStore);
            // Save to local storage
            if (typeof window !== 'undefined') {
                window.localStorage.setItem(key, JSON.stringify(valueToStore));
            }
        } catch (error) {
            // A more advanced implementation would handle the error case
            console.error(error);
        }
    };

    // Listen for changes to this localStorage key in other tabs/windows
    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === key && e.newValue !== null) {
                try {
                    setStoredValue(JSON.parse(e.newValue));
                } catch (error) {
                    console.error(error);
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [key]);

    return [storedValue, setValue];
}

export default useLocalStorage;
