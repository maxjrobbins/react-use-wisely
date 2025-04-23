// Final fixed version of useSet.js
import { useState, useCallback, useRef } from 'react';

/**
 * Hook for managing Set data structures
 * @param {Iterable} initialValue - Initial Set values
 * @returns {Array} - [set, actions]
 */
const useSet = (initialValue = []) => {
	// Initialize the set state
	const [set, setSet] = useState(new Set(initialValue));

	// Use a ref to store the current set for the `has` method
	// This ensures we can access the latest set even in closure
	const setRef = useRef(set);

	// Update ref whenever set changes
	setRef.current = set;

	const actions = {
		add: useCallback((item) => {
			setSet(prevSet => {
				const newSet = new Set(prevSet);
				newSet.add(item);
				return newSet;
			});
		}, []),

		remove: useCallback((item) => {
			setSet(prevSet => {
				const newSet = new Set(prevSet);
				newSet.delete(item);
				return newSet;
			});
		}, []),

		clear: useCallback(() => {
			setSet(new Set());
		}, []),

		// Return the current set value, not dependent on state closure
		has: useCallback((item) => {
			return setRef.current.has(item);
		}, []),

		toggle: useCallback((item) => {
			setSet(prevSet => {
				const newSet = new Set(prevSet);
				if (newSet.has(item)) {
					newSet.delete(item);
				} else {
					newSet.add(item);
				}
				return newSet;
			});
		}, [])
	};

	return [set, actions];
};

export default useSet;
