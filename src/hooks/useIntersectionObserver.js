// Detect when an element is visible in the viewport
import { useState, useEffect, useRef } from 'react';

/**
 * Hook that tracks when an element is visible in the viewport
 * @param {Object} options - IntersectionObserver options
 * @returns {Array} [ref, isIntersecting] - Ref to attach and visibility state
 */
const useIntersectionObserver = (options = {}) => {
	const [isIntersecting, setIsIntersecting] = useState(false);
	const ref = useRef(null);

	useEffect(() => {
		const currentRef = ref.current;
		if (!currentRef) return;

		const observer = new IntersectionObserver(([entry]) => {
			setIsIntersecting(entry.isIntersecting);
		}, options);

		observer.observe(currentRef);

		return () => {
			observer.unobserve(currentRef);
		};
	}, [options]); // Removed ref.current from dependencies

	return [ref, isIntersecting];
}

export default useIntersectionObserver;
