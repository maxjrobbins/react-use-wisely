// Debug component re-renders
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
	const prevProps = useRef({});

	useEffect(() => {
		if (prevProps.current) {
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

			// If there were changes, log them
			if (Object.keys(changesObj).length) {
				console.log('[why-did-you-update]', componentName, changesObj);
			}
		}

		// Update previous props
		prevProps.current = props;
	});
};

export default useWhyDidYouUpdate;
