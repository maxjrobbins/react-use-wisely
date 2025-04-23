// Track element dimensions changes
import { useState, useEffect, useRef } from 'react';

/**
 * Hook that observes an element's dimensions
 * @returns {Array} - [ref, dimensions]
 */
const useResizeObserver = () => {
	const [dimensions, setDimensions] = useState({});
	const ref = useRef(null);

	useEffect(() => {
		if (!ref.current) return;

		if (typeof ResizeObserver === 'undefined') {
			console.warn('ResizeObserver is not supported in this browser');
			return;
		}

		const element = ref.current;
		const resizeObserver = new ResizeObserver(entries => {
			if (!entries.length) return;

			const { contentRect } = entries[0];
			setDimensions({
				width: contentRect.width,
				height: contentRect.height,
				top: contentRect.top,
				left: contentRect.left,
				right: contentRect.right,
				bottom: contentRect.bottom,
				x: contentRect.x,
				y: contentRect.y
			});
		});

		resizeObserver.observe(element);

		return () => {
			resizeObserver.disconnect();
		};
	}, [ref.current]);

	return [ref, dimensions];
};

export default useResizeObserver;
