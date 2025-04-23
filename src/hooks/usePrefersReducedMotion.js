// Respect user's motion preferences
import { useState, useEffect } from 'react';

/**
 * Hook that detects if the user has requested reduced motion
 * @returns {boolean} - True if reduced motion is preferred
 */
const usePrefersReducedMotion = () => {
	// Default to false (no preference) if query is not supported
	const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

	useEffect(() => {
		// Return early if SSR or if the API is not supported
		if (typeof window === 'undefined' || !window.matchMedia) {
			return;
		}

		const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

		// Set initial value
		setPrefersReducedMotion(mediaQuery.matches);

		// Create event listener
		const onChange = (event) => {
			setPrefersReducedMotion(event.matches);
		};

		// Listen for changes
		if (mediaQuery.addEventListener) {
			mediaQuery.addEventListener('change', onChange);
		} else {
			// Older browsers
			mediaQuery.addListener(onChange);
		}

		// Clean up
		return () => {
			if (mediaQuery.removeEventListener) {
				mediaQuery.removeEventListener('change', onChange);
			} else {
				// Older browsers
				mediaQuery.removeListener(onChange);
			}
		};
	}, []);

	return prefersReducedMotion;
};

export default usePrefersReducedMotion;
