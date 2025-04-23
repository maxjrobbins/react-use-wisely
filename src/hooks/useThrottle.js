// Similar to debounce but executes at regular intervals
import { useState, useEffect, useRef } from 'react';

/**
 * Hook for throttling value changes
 * @param {any} value - The value to throttle
 * @param {number} limit - The time limit in ms
 * @returns {any} - The throttled value
 */
const useThrottle = (value, limit) => {
	const [throttledValue, setThrottledValue] = useState(value);
	const lastRan = useRef(Date.now());

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
};

export default useThrottle;
