import { useState, useEffect } from 'react';

/**
 * Hook for media queries
 * @param {string} query - The media query string
 * @param {boolean} defaultState - Default state before matches is detected
 * @returns {boolean} - True if the media query matches
 */
const useMedia = (query, defaultState = false) => {
	// Initialize with defaultState if matchMedia isn't available
	const [state, setState] = useState(() => {
		try {
			return window.matchMedia ? window.matchMedia(query).matches : defaultState;
		} catch (e) {
			return defaultState;
		}
	});

	useEffect(() => {
		// Return early if matchMedia is not available
		if (!window.matchMedia) {
			return undefined;
		}

		let mounted = true;
		const mql = window.matchMedia(query);

		const onChange = () => {
			if (!mounted) return;
			setState(mql.matches);
		};

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
