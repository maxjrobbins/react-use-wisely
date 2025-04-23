import { useState, useEffect } from 'react';

/**
 * Hook for media queries
 * @param {string} query - The media query string
 * @param {boolean} defaultState - Default state before matches is detected
 * @returns {boolean} - True if the media query matches
 */
const useMedia = (query, defaultState = false) => {
	const [state, setState] = useState(defaultState);

	useEffect(() => {
		let mounted = true;
		const mql = window.matchMedia(query);

		const onChange = () => {
			if (!mounted) return;
			setState(mql.matches);
		};

		// Set initial value
		setState(mql.matches);

		// Listen for changes
		// Modern browsers
		if (mql.addEventListener) {
			mql.addEventListener('change', onChange);
			return () => {
				mounted = false;
				mql.removeEventListener('change', onChange);
			};
		}
		// Older browsers
		else if (mql.addListener) {
			mql.addListener(onChange);
			return () => {
				mounted = false;
				mql.removeListener(onChange);
			};
		}

		return () => {
			mounted = false;
		};
	}, [query]);

	return state;
};

export default useMedia;
