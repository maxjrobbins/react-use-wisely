// Track element hover state
import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Hook for tracking hover state on an element
 * @returns {Array} - [ref, isHovered]
 */
const useHover = () => {
	const [isHovered, setIsHovered] = useState(false);
	const ref = useRef(null);

	// Create stable callback functions
	const handleMouseEnter = useCallback(() => {
		setIsHovered(true);
	}, []);

	const handleMouseLeave = useCallback(() => {
		setIsHovered(false);
	}, []);

	useEffect(() => {
		const element = ref.current;

		// When element is removed, reset hover state
		if (!element) {
			setIsHovered(false);
			return;
		}

		// Add event listeners
		element.addEventListener('mouseenter', handleMouseEnter);
		element.addEventListener('mouseleave', handleMouseLeave);

		// Clean up
		return () => {
			element.removeEventListener('mouseenter', handleMouseEnter);
			element.removeEventListener('mouseleave', handleMouseLeave);
			// Reset hover state when element is unmounted
			setIsHovered(false);
		};
	}, [handleMouseEnter, handleMouseLeave]);

	return [ref, isHovered];
};

export default useHover;
