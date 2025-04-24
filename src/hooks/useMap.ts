// State management for Map data structures
import { useState, useCallback } from "react";

/**
 * Hook for managing Map data structures
 * @template K - Key type
 * @template V - Value type
 * @param initialValue - Initial Map entries
 * @returns [map, actions] - The map instance and actions to manipulate it
 */
const useMap = <K = any, V = any>(
  initialValue: Iterable<readonly [K, V]> = []
) => {
  const [map, setMap] = useState<Map<K, V>>(new Map(initialValue));

  const actions = {
    set: useCallback((key: K, value: V) => {
      setMap((prevMap) => {
        const newMap = new Map(prevMap);
        newMap.set(key, value);
        return newMap;
      });
    }, []),

    delete: useCallback((key: K) => {
      setMap((prevMap) => {
        const newMap = new Map(prevMap);
        newMap.delete(key);
        return newMap;
      });
    }, []),

    clear: useCallback(() => {
      setMap(new Map<K, V>());
    }, []),

    get: useCallback(
      (key: K): V | undefined => {
        return map.get(key);
      },
      [map]
    ),

    has: useCallback(
      (key: K): boolean => {
        return map.has(key);
      },
      [map]
    ),
  };

  return [map, actions] as const;
};

export default useMap;
