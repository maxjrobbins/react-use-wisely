/**
 * Utility hooks
 * @module utilities
 */

export { default as useDebounce } from "../hooks/useDebounce";
export { default as useThrottle } from "../hooks/useThrottle";
export { default as useTimeout } from "../hooks/useTimeout";
export { default as useInterval } from "../hooks/useInterval";
export { default as useLocalStorage } from "../hooks/useLocalStorage";
export { default as useSessionStorage } from "../hooks/useSessionStorage";
export { default as usePrevious } from "../hooks/usePrevious";
export { default as useMap } from "../hooks/useMap";
export { default as useSet } from "../hooks/useSet";
export { default as useMountedRef } from "../hooks/useMountedRef";
export { default as useWhyDidYouUpdate } from "../hooks/useWhyDidYouUpdate";
export { default as useErrorBoundary } from "../hooks/useErrorBoundary";

// Re-export types from utilities
export type {
  StorageResult,
  ErrorBoundaryState,
  MapActions,
  SetActions,
  Status,
} from "../types/utilities";
