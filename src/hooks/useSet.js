// State management for Set data structures
import { useState, useCallback } from 'react';

/**
 * Hook for managing Set data structures
 * @param {Iterable} initialValue - Initial Set values
 * @returns {Object} - Set state and operations
 */
const useSet = (initialValue = []) => {
	const [set, setSet] = useState(new Set(initialValue));

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

		has: useCallback((item) => {
			return set.has(item);
		}, [set]),

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
