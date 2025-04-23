// Detect user inactivity
import { useState, useEffect, useCallback } from 'react';

/**
 * Hook that tracks user idle state
 * @param {number} timeout - Idle timeout in ms
 * @param {Array} events - DOM events to reset idle timer
 * @returns {boolean} - True if user is idle
 */
const useIdle = (timeout = 60000, events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart']) => {
	const [idle, setIdle] = useState(false);

	const handleActivity = useCallback(() => {
		setIdle(false);

		// Reset timeout
		const timeoutId = setTimeout(() => {
			setIdle(true);
		}, timeout);

		return () => {
			clearTimeout(timeoutId);
		};
	}, [timeout]);

	useEffect(() => {
		const cleanup = handleActivity();

		// Add event listeners
		events.forEach(event => {
			document.addEventListener(event, handleActivity);
		});

		// Clean up
		return () => {
			cleanup();
			events.forEach(event => {
				document.removeEventListener(event, handleActivity);
			});
		};
	}, [events, handleActivity]);

	return idle;
};

export default useIdle;
