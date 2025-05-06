/**
 * Common type for setter functions that match React's useState pattern
 */
export type SetValue<T> = React.Dispatch<React.SetStateAction<T>>;

/**
 * Status type used across multiple hooks
 */
export type Status = "idle" | "loading" | "success" | "error";

/**
 * Common type for network connection types
 */
export type ConnectionType =
  | "bluetooth"
  | "cellular"
  | "ethernet"
  | "mixed"
  | "none"
  | "other"
  | "unknown"
  | "wifi"
  | "wimax";

/**
 * Common type for network connection effective types
 */
export type ConnectionEffectiveType = "slow-2g" | "2g" | "3g" | "4g";

/**
 * Common permission name types
 */
export type PermissionName =
  | "geolocation"
  | "notifications"
  | "push"
  | "midi"
  | "camera"
  | "microphone"
  | "speaker"
  | "device-info"
  | "background-sync"
  | "bluetooth"
  | "persistent-storage"
  | "ambient-light-sensor"
  | "accelerometer"
  | "gyroscope"
  | "magnetometer"
  | "clipboard-read"
  | "clipboard-write"
  | "display-capture"
  | "nfc";

/**
 * Type for a generic callback function
 */
export type Callback = (...args: any[]) => any;

/**
 * Type for a cleanup function returned from hooks
 */
export type CleanupFunction = () => void;

/**
 * Type for media matching options
 */
export interface MediaQueryOptions {
  defaultState?: boolean;
  ssr?: boolean;
}
