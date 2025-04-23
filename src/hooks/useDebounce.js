import { useState, useEffect } from 'react';

/**
 * Hook for debouncing value changes
 * @param {any} value - The value to debounce
 * @param {number} delay - The delay in ms
 * @returns {any} - The debounced value
 */
const useDebounce = (value, delay) => {
	const [debouncedValue, setDebouncedValue] = useState(value);

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

	return debouncedValue;
};

export default useDebounce;
