import {
  ConnectionType,
  ConnectionEffectiveType,
  PermissionName,
} from "../utils/types";

/**
 * Network connection information
 */
export interface ConnectionInfo {
  downlink: number | null;
  rtt: number | null;
  effectiveType: ConnectionEffectiveType | null;
  saveData: boolean | null;
  type: ConnectionType | null;
}

/**
 * Permission state information
 */
export interface PermissionInfo {
  state: PermissionState | "unsupported";
  isGranted: boolean;
  isDenied: boolean;
  isPrompt: boolean;
}

export type { ConnectionType, ConnectionEffectiveType, PermissionName };
