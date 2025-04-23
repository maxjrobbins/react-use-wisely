import { useRef, useEffect } from 'react';

/**
 * Hook to track previous value of a variable
 * @param {any} value - The value to track
 * @returns {any} The previous value
 */
const usePrevious = (value) => {
	const ref = useRef();

	useEffect(() => {
		ref.current = value;
	}, [value]);

	return ref.current;
}

export default usePrevious;
