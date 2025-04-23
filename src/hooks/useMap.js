// State management for Map data structures
import { useState, useCallback } from 'react';

/**
 * Hook for managing Map data structures
 * @param {Iterable} initialValue - Initial Map entries
 * @returns {Array} - [map, actions]
 */
const useMap = (initialValue = []) => {
	const [map, setMap] = useState(new Map(initialValue));

	const actions = {
		set: useCallback((key, value) => {
			setMap(prevMap => {
				const newMap = new Map(prevMap);
				newMap.set(key, value);
				return newMap;
			});
		}, []),

		delete: useCallback((key) => {
			setMap(prevMap => {
				const newMap = new Map(prevMap);
				newMap.delete(key);
				return newMap;
			});
		}, []),

		clear: useCallback(() => {
			setMap(new Map());
		}, []),

		get: useCallback((key) => {
			return map.get(key);
		}, [map]),

		has: useCallback((key) => {
			return map.has(key);
		}, [map])
	};

	return [map, actions];
};

export default useMap;
