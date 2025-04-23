// Fixed hook implementation
import { useEffect, useRef } from 'react';

/**
 * Hook that helps debug which props are causing re-renders
 * @param {string} componentName - Name for logging
 * @param {Object} props - Component props
 */
const useWhyDidYouUpdate = (componentName, props) => {
	// Only run in development
	if (process.env.NODE_ENV === 'production') {
		return;
	}

	// Store previous props
	const prevProps = useRef();

	// Use ref to track if we've already logged in this render cycle
	const didLog = useRef(false);

	useEffect(() => {
		// Skip first render
		if (!prevProps.current) {
			prevProps.current = { ...props };
			return;
		}

		// Reset logging flag at the start of effect
		didLog.current = false;

		// Get keys from current and previous props
		const allKeys = Object.keys({ ...prevProps.current, ...props });
		const changesObj = {};

		allKeys.forEach(key => {
			// If previous is different from current
			if (prevProps.current[key] !== props[key]) {
				changesObj[key] = {
					from: prevProps.current[key],
					to: props[key]
				};
			}
		});

		// If there were changes and we haven't logged yet, log them
		if (Object.keys(changesObj).length && !didLog.current) {
			console.log('[why-did-you-update]', componentName, changesObj);
			didLog.current = true;
		}

		// Update previous props with a complete copy
		prevProps.current = { ...props };
	});
};

export default useWhyDidYouUpdate;
