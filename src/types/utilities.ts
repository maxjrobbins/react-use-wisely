import { Status } from "../utils/types";

/**
 * Storage operation result
 */
export interface StorageResult<T> {
  value: T;
  error: Error | null;
  set: (newValue: T | ((prev: T) => T)) => void;
  remove: () => void;
}

/**
 * Error boundary state
 */
export interface ErrorBoundaryState {
  error: Error | null;
  hasError: boolean;
}

/**
 * Map operation methods
 */
export interface MapActions<K, V> {
  set: (key: K, value: V) => void;
  get: (key: K) => V | undefined;
  remove: (key: K) => void;
  clear: () => void;
  has: (key: K) => boolean;
}

/**
 * Set operation methods
 */
export interface SetActions<T> {
  add: (value: T) => void;
  remove: (value: T) => void;
  clear: () => void;
  has: (value: T) => boolean;
  toggle: (value: T) => void;
}

export type { Status };
