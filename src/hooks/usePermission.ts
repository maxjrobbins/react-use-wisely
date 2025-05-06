import { useState, useEffect, useCallback } from "react";
import { PermissionError } from "./errors";
import { features } from "../utils/browser";

// Use PermissionName from the DOM types if available, or define our own
type CustomPermissionName =
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

interface PermissionResult {
  state: PermissionState | "unsupported";
  isGranted: boolean;
  isDenied: boolean;
  isPrompt: boolean;
  isSupported: boolean;
  isLoading: boolean;
  error: PermissionError | null;
  request: () => Promise<PermissionState | "unsupported">;
}

/**
 * Hook for handling browser permission requests
 * @param {string} permissionName - The name of the permission to request
 * @returns {PermissionResult} Permission state and control functions
 */
function usePermission(permissionName: CustomPermissionName): PermissionResult {
  // Initialize state to "unsupported" to match the expected initial state
  const [state, setState] = useState<PermissionState | "unsupported">(
    "unsupported"
  );
  const [error, setError] = useState<PermissionError | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Check if permissions API is supported using our feature detection
  const isPermissionsSupported = features.permissions();

  // Check for specific feature support based on permission name
  const getFeatureSupport = useCallback((): boolean => {
    switch (permissionName) {
      case "geolocation":
        return features.geolocation();
      case "notifications":
        return features.notifications();
      case "clipboard-read":
        return features.clipboard.read();
      case "clipboard-write":
        return features.clipboard.write();
      case "camera":
      case "microphone":
        return features.mediaDevices.getUserMedia();
      default:
        // For other permissions, rely on the Permissions API
        return isPermissionsSupported;
    }
  }, [permissionName, isPermissionsSupported]);

  // Is the specific feature supported
  const isFeatureSupported = getFeatureSupport();
  const isSupported = isFeatureSupported;

  // Derived state
  const isGranted = state === "granted";
  const isDenied = state === "denied";
  const isPrompt = state === "prompt";

  // Get current permission state
  const getPermissionState = useCallback(async (): Promise<
    PermissionState | "unsupported"
  > => {
    // First check if the feature is supported
    if (!isFeatureSupported) {
      return "unsupported";
    }

    // If permissions API is supported, try it first
    if (isPermissionsSupported) {
      try {
        // Cast to any to avoid type conflicts between our CustomPermissionName and browser's PermissionName
        const permissionStatus = await navigator.permissions.query({
          name: permissionName as any,
        });
        return permissionStatus.state;
      } catch (err) {
        setError(
          new PermissionError(
            `Error querying permission: ${permissionName}`,
            err,
            { permissionName }
          )
        );

        // If permissions API fails for notifications, fallback to Notification API
        if (permissionName === "notifications" && "Notification" in window) {
          return Notification.permission as PermissionState;
        }

        return "unsupported";
      }
    }

    // If permissions API is not supported but it's a notification permission
    if (permissionName === "notifications" && "Notification" in window) {
      return Notification.permission as PermissionState;
    }

    return "unsupported";
  }, [permissionName, isPermissionsSupported, isFeatureSupported]);

  // Initial permission check and setup permission change listener
  useEffect(() => {
    let permissionStatus: PermissionStatus | null = null;
    let isUnmounted = false;

    const checkPermission = async () => {
      try {
        // First check if the feature is supported
        if (!isFeatureSupported) {
          if (!isUnmounted) {
            setState("unsupported");
          }
          return;
        }

        // If permissions API is supported, try it first
        if (isPermissionsSupported) {
          // Query the permission
          permissionStatus = await navigator.permissions.query({
            name: permissionName as any,
          });

          // Don't update state if component unmounted
          if (isUnmounted) return;

          // Update state based on current status
          setState(permissionStatus.state);

          // Listen for changes
          const handleChange = () => {
            if (!isUnmounted && permissionStatus) {
              setState(permissionStatus.state);
            }
          };

          permissionStatus.addEventListener("change", handleChange);

          // Cleanup listener
          return () => {
            if (permissionStatus) {
              permissionStatus.removeEventListener("change", handleChange);
            }
          };
        } else if (
          permissionName === "notifications" &&
          "Notification" in window
        ) {
          // If permissions API is not supported but it's a notification permission
          if (!isUnmounted) {
            setState(Notification.permission as PermissionState);
          }
        } else {
          // No API available
          if (!isUnmounted) {
            setState("unsupported");
          }
        }
      } catch (err) {
        if (!isUnmounted) {
          // For notifications, fallback to Notification API if available
          if (permissionName === "notifications" && "Notification" in window) {
            setState(Notification.permission as PermissionState);
          } else {
            setState("unsupported");
          }
          setError(
            new PermissionError(
              `Error setting up permission listener: ${permissionName}`,
              err,
              { permissionName }
            )
          );
        }
      }
    };

    // Run initial check
    checkPermission();

    // Cleanup
    return () => {
      isUnmounted = true;
    };
  }, [permissionName, isPermissionsSupported, isFeatureSupported]);

  // Request permission (for some permissions this will trigger the prompt)
  const request = useCallback(async (): Promise<
    PermissionState | "unsupported"
  > => {
    if (!isFeatureSupported) {
      setError(
        new PermissionError(
          `${permissionName} is not supported in this browser`,
          null,
          { permissionName }
        )
      );
      return "unsupported";
    }

    setIsLoading(true);

    try {
      // Different permissions use different APIs to request access
      switch (permissionName) {
        case "geolocation":
          await new Promise<GeolocationPosition>((resolve, reject) => {
            if ("geolocation" in navigator) {
              const timeoutId = setTimeout(() => {
                reject(new Error("Geolocation request timed out"));
              }, 10000);

              navigator.geolocation.getCurrentPosition(
                (position) => {
                  clearTimeout(timeoutId);
                  resolve(position);
                },
                (error) => {
                  clearTimeout(timeoutId);
                  reject(error);
                }
              );
            } else {
              reject(new Error("Geolocation not supported"));
            }
          });
          break;
        case "notifications":
          if ("Notification" in window) {
            const result = await Notification.requestPermission();
            // Immediately update state for notifications since we have the result
            setState(result as PermissionState);
            setError(null);
            setIsLoading(false);
            return result as PermissionState;
          } else {
            throw new Error("Notifications not supported");
          }
        case "microphone":
        case "camera":
          if (
            "mediaDevices" in navigator &&
            "getUserMedia" in navigator.mediaDevices
          ) {
            await navigator.mediaDevices.getUserMedia({
              audio: permissionName === "microphone",
              video: permissionName === "camera",
            });
          } else {
            throw new Error(`${permissionName} access not supported`);
          }
          break;
        case "clipboard-read":
          if ("clipboard" in navigator && "readText" in navigator.clipboard) {
            await navigator.clipboard.readText();
          } else {
            throw new Error("Clipboard read not supported");
          }
          break;
        case "clipboard-write":
          if ("clipboard" in navigator && "writeText" in navigator.clipboard) {
            await navigator.clipboard.writeText("Permission test");
          } else {
            throw new Error("Clipboard write not supported");
          }
          break;
        default:
          if (!isPermissionsSupported) {
            throw new Error("Permissions API not supported");
          }
          break;
      }

      // For permissions other than notifications, get the updated state
      const newState = await getPermissionState();
      setState(newState);
      setError(null);
      return newState;
    } catch (err) {
      const permissionError = new PermissionError(
        `Error requesting permission: ${permissionName}`,
        err,
        { permissionName }
      );
      setError(permissionError);

      // Try to get the current state despite the error
      const currentState = await getPermissionState();
      setState(currentState);
      return currentState;
    } finally {
      setIsLoading(false);
    }
  }, [
    permissionName,
    getPermissionState,
    isFeatureSupported,
    isPermissionsSupported,
  ]);

  return {
    state,
    isGranted,
    isDenied,
    isPrompt,
    isSupported,
    isLoading,
    error,
    request,
  };
}

export default usePermission;
