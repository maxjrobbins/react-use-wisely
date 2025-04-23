// Detect when a specific key is pressed
import { useState, useEffect } from 'react';

/**
 * Hook that detects when a specific key is pressed
 * @param {string} targetKey - The key to detect
 * @returns {boolean} True if the key is pressed
 */
const useKeyPress = (targetKey) => {
	const [keyPressed, setKeyPressed] = useState(false);

	useEffect(() => {
		const downHandler = ({ key }) => {
			if (key === targetKey) {
				setKeyPressed(true);
			}
		};

		const upHandler = ({ key }) => {
			if (key === targetKey) {
				setKeyPressed(false);
			}
		};

		window.addEventListener('keydown', downHandler);
		window.addEventListener('keyup', upHandler);

		return () => {
			window.removeEventListener('keydown', downHandler);
			window.removeEventListener('keyup', upHandler);
		};
	}, [targetKey]);

	return keyPressed;
}

export default useKeyPress;
