import { useState, useEffect } from 'react';

/**
 * Hook for managing localStorage values
 * @param {string} key - The localStorage key
 * @param {any} initialValue - The initial value
 * @returns {Array} - [storedValue, setValue] similar to useState
 */
const useLocalStorage = (key, initialValue) => {
	// State to store our value
	const [storedValue, setStoredValue] = useState(() => {
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
	const setValue = (value) => {
		try {
			// Allow value to be a function so we have same API as useState
			const valueToStore =
				value instanceof Function ? value(storedValue) : value;
			// Save state
			setStoredValue(valueToStore);
			// Save to local storage
			window.localStorage.setItem(key, JSON.stringify(valueToStore));
		} catch (error) {
			// A more advanced implementation would handle the error case
			console.error(error);
		}
	};

	// Listen for changes to this localStorage key in other tabs/windows
	useEffect(() => {
		const handleStorageChange = (e) => {
			if (e.key === key) {
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
};

export default useLocalStorage;
