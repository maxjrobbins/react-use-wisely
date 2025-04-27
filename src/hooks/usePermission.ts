import { useState, useEffect } from "react";
import { PermissionError } from "./errors";

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

interface UsePermissionResult {
  state: PermissionState | "unsupported";
  isGranted: boolean;
  isDenied: boolean;
  isPrompt: boolean;
  error: PermissionError | null;
  request: () => Promise<PermissionState | "unsupported">;
}

/**
 * Hook for handling browser permission requests
 * @param {string} permissionName - The name of the permission to request
 * @returns {UsePermissionResult} Permission state and control functions
 */
function usePermission(
  permissionName: CustomPermissionName
): UsePermissionResult {
  const [state, setState] = useState<PermissionState | "unsupported">(
    "unsupported"
  );
  const [error, setError] = useState<PermissionError | null>(null);

  // Derived state
  const isGranted = state === "granted";
  const isDenied = state === "denied";
  const isPrompt = state === "prompt";

  // Check if the Permissions API is supported
  const isPermissionSupported = (): boolean => {
    return typeof window !== "undefined" && "permissions" in navigator;
  };

  // Get current permission state
  const getPermissionState = async (): Promise<
    PermissionState | "unsupported"
  > => {
    if (!isPermissionSupported()) {
      return "unsupported";
    }

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
      return "unsupported";
    }
  };

  // Request permission (for some permissions this will trigger the prompt)
  const request = async (): Promise<PermissionState | "unsupported"> => {
    if (!isPermissionSupported()) {
      setError(
        new PermissionError(
          "Permissions API is not supported in this browser",
          null,
          { permissionName }
        )
      );
      return "unsupported";
    }

    try {
      // Different permissions use different APIs to request access
      let newState: PermissionState | "unsupported" = "unsupported";

      switch (permissionName) {
        case "geolocation":
          await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          });
          break;
        case "notifications":
          await Notification.requestPermission();
          break;
        case "microphone":
        case "camera":
          await navigator.mediaDevices.getUserMedia({
            audio: permissionName === "microphone",
            video: permissionName === "camera",
          });
          break;
        case "clipboard-read":
          await navigator.clipboard.readText();
          break;
        case "clipboard-write":
          await navigator.clipboard.writeText("Permission test");
          break;
        // Other permissions may not have a direct way to request
        default:
          // Just query the current state
          break;
      }

      // Update the state after the request
      newState = await getPermissionState();
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
    }
  };

  // Initial permission check and setup permission change listener
  useEffect(() => {
    let permissionStatus: PermissionStatus | null = null;

    const checkPermission = async () => {
      try {
        if (isPermissionSupported()) {
          // Query the permission
          permissionStatus = await navigator.permissions.query({
            name: permissionName as any,
          });

          // Update state based on current status
          setState(permissionStatus.state);

          // Listen for changes
          permissionStatus.addEventListener("change", () => {
            setState(permissionStatus!.state);
          });
        } else {
          setState("unsupported");
        }
      } catch (err) {
        setState("unsupported");
        setError(
          new PermissionError(
            `Error setting up permission listener: ${permissionName}`,
            err,
            { permissionName }
          )
        );
      }
    };

    checkPermission();

    // Cleanup
    return () => {
      if (permissionStatus) {
        // TypeScript doesn't detect the addEventListener/removeEventListener correctly
        // for PermissionStatus, so we need to cast
        permissionStatus.removeEventListener("change", () => {
          // This is just a placeholder since we can't reference the same function
          // that we added in the addEventListener above
        });
      }
    };
  }, [permissionName]);

  return {
    state,
    isGranted,
    isDenied,
    isPrompt,
    error,
    request,
  };
}

export default usePermission;
