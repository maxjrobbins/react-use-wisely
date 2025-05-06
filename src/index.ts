export { default as useAsync } from "./hooks/useAsync";
export { default as useLocalStorage } from "./hooks/useLocalStorage";
export { default as useDebounce } from "./hooks/useDebounce";
export { default as useMedia } from "./hooks/useMedia";
export { default as useClickOutside } from "./hooks/useClickOutside";
export { default as useWindowSize } from "./hooks/useWindowSize";
export { default as useForm } from "./hooks/useForm";
export { default as usePrevious } from "./hooks/usePrevious";
export { default as useIntersectionObserver } from "./hooks/useIntersectionObserver";
export { default as useOnline } from "./hooks/useOnline";
export { default as useClipboard } from "./hooks/useClipboard";
export { default as useKeyPress } from "./hooks/useKeyPress";
export { default as useEventListener } from "./hooks/useEventListener";
export { default as useFetch } from "./hooks/useFetch";
export { default as useInterval } from "./hooks/useInterval";
export { default as useTimeout } from "./hooks/useTimeout";
export { default as useMountedRef } from "./hooks/useMountedRef";
export { default as useScrollPosition } from "./hooks/useScrollPosition";
export { default as useScript } from "./hooks/useScript";
export { default as useSessionStorage } from "./hooks/useSessionStorage";
export { default as usePageVisibility } from "./hooks/usePageVisibility";
export { default as usePermission } from "./hooks/usePermission";
export { default as useSpeechRecognition } from "./hooks/useSpeechRecognition";
export { default as useErrorBoundary } from "./hooks/useErrorBoundary";

export type {
  // Browser types
  ConnectionInfo,
  PermissionInfo,
  ConnectionType,
  ConnectionEffectiveType,
  PermissionName,

  // DOM types
  ScrollPosition,
  WindowSize,
  IntersectionOptions,
  ResizeObserverOptions,

  // Utility types
  StorageResult,
  ErrorBoundaryState,
  MapActions,
  SetActions,

  // Async types
  AsyncResult,
  FetchOptions,
  FormOptions,
  FormErrors,
  FormTouched,
  Status,
} from "./categories";
