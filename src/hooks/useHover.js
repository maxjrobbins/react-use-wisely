// Track element hover state
import { useState, useEffect, useRef } from 'react';

/**
 * Hook for tracking hover state on an element
 * @returns {Array} - [ref, isHovered]
 */
const useHover = () => {
	const [isHovered, setIsHovered] = useState(false);
	const ref = useRef(null);

	useEffect(() => {
		const element = ref.current;
		if (!element) return;

		const handleMouseEnter = () => setIsHovered(true);
		const handleMouseLeave = () => setIsHovered(false);

		element.addEventListener('mouseenter', handleMouseEnter);
		element.addEventListener('mouseleave', handleMouseLeave);

		return () => {
			element.removeEventListener('mouseenter', handleMouseEnter);
			element.removeEventListener('mouseleave', handleMouseLeave);
		};
	}, [ref.current]);

	return [ref, isHovered];
};

export default useHover;
