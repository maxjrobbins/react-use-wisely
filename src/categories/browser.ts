/**
 * Browser API hooks
 * @module browser
 */

export { default as useOnline } from "../hooks/useOnline";
export { default as useNetworkSpeed } from "../hooks/useNetworkSpeed";
export { default as useClipboard } from "../hooks/useClipboard";
export { default as useGeolocation } from "../hooks/useGeolocation";
export { default as usePermission } from "../hooks/usePermission";
export { default as useSpeechRecognition } from "../hooks/useSpeechRecognition";
export { default as useMedia } from "../hooks/useMedia";
export { default as usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
export { default as usePageVisibility } from "../hooks/usePageVisibility";
export { default as useScript } from "../hooks/useScript";
export { default as useIdle } from "../hooks/useIdle";

export type {
  ConnectionInfo,
  PermissionInfo,
  ConnectionType,
  ConnectionEffectiveType,
  PermissionName,
} from "../types/browser";
