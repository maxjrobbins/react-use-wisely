// Detect clicks outside of a specified element
import { useEffect, useRef } from 'react';

/**
 * Hook that alerts when you click outside of the passed ref
 * @param {Function} callback - Function to call on outside click
 * @returns {React.MutableRefObject} - Ref to attach to the element
 */
export default function useClickOutside(callback) {
	const ref = useRef(null);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (ref.current && !ref.current.contains(event.target)) {
				callback();
			}
		};

		document.addEventListener('mousedown', handleClickOutside);

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [callback]);

	return ref;
}
