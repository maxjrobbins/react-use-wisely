// State management for Map data structures
import { useState, useCallback } from "react";

/**
 * Hook for managing Map data structures
 * @template K - Key type
 * @template V - Value type
 * @param initialValue - Initial Map entries
 * @returns Object with map value and actions
 */
const useMap = <K = any, V = any>(
  initialValue: Iterable<readonly [K, V]> = []
) => {
  const [value, setValue] = useState<Map<K, V>>(new Map(initialValue));

  const set = useCallback((key: K, value: V) => {
    setValue((prevMap) => {
      const newMap = new Map(prevMap);
      newMap.set(key, value);
      return newMap;
    });
  }, []);

  const remove = useCallback((key: K) => {
    setValue((prevMap) => {
      const newMap = new Map(prevMap);
      newMap.delete(key);
      return newMap;
    });
  }, []);

  const clear = useCallback(() => {
    setValue(new Map<K, V>());
  }, []);

  const get = useCallback(
    (key: K): V | undefined => {
      return value.get(key);
    },
    [value]
  );

  const has = useCallback(
    (key: K): boolean => {
      return value.has(key);
    },
    [value]
  );

  const reset = useCallback(() => {
    setValue(new Map(initialValue));
  }, [initialValue]);

  return {
    value,
    set,
    remove,
    clear,
    get,
    has,
    reset,
    error: null,
  };
};

export default useMap;
