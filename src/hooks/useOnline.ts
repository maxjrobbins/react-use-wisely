// Track online status
import { useState, useEffect, useCallback } from "react";
import { NetworkError } from "./errors";
import { features, runInBrowser } from "../utils/browser";

/**
 * Interface for the online state returned by the useOnline hook
 */
interface OnlineState {
  isOnline: boolean;
  error: NetworkError | null;
  lastChanged: Date | null;
  isSupported: boolean;
}

/**
 * Hook that tracks online status
 * @returns An object with online status, support status, error information, and last changed timestamp
 */
const useOnline = (): OnlineState => {
  // Check if the online/offline API is supported
  const isSupported = features.online();

  const [state, setState] = useState<OnlineState>(() => {
    try {
      // If in a browser and API is supported, get the initial status
      return {
        isOnline: runInBrowser(
            () => (isSupported ? navigator.onLine : true),
            () => true // Default to online for SSR
        ),
        error: null,
        lastChanged: null,
        isSupported,
      };
    } catch (error) {
      const networkError = new NetworkError(
          "Failed to determine initial online status",
          error
      );
      console.error(networkError);
      return {
        isOnline: true, // Assume online by default
        error: networkError,
        lastChanged: null,
        isSupported: false,
      };
    }
  });

  // Use useCallback to memoize these handlers to avoid recreating them on each render
  const handleOnline = useCallback((): void => {
    setState({
      isOnline: true,
      error: null,
      lastChanged: new Date(),
      isSupported,
    });
  }, [isSupported]);

  const handleOffline = useCallback((): void => {
    setState({
      isOnline: false,
      error: null,
      lastChanged: new Date(),
      isSupported,
    });
  }, [isSupported]);

  // Effect for handling event listeners
  useEffect(() => {
    // Don't set up listeners if not in browser or API not supported
    if (!isSupported) {
      return;
    }

    try {
      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);

      return () => {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
      };
    } catch (error) {
      const networkError = new NetworkError(
          "Failed to set up network status listeners",
          error
      );
      console.error(networkError);
      setState((prev) => ({
        ...prev,
        error: networkError,
        isSupported: false,
      }));
      return () => {};
    }
  }, [isSupported, handleOnline, handleOffline]);

  // Effect for ping functionality
  useEffect(() => {
    // Skip setup if not supported or not in browser
    if (!isSupported || typeof window === "undefined" || !("fetch" in window)) {
      return;
    }

    let pingIntervalId: number | null = null;
    const pingEndpoint = "https://www.google.com/favicon.ico";
    const pingInterval = 30000; // 30 seconds

    const checkConnection = async (): Promise<void> => {
      try {
        // Skip check if navigator is not available or already offline
        if (typeof navigator === "undefined" || !navigator.onLine) {
          return;
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        try {
          await fetch(pingEndpoint, {
            method: "HEAD",
            mode: "no-cors",
            cache: "no-store",
            signal: controller.signal,
          });

          clearTimeout(timeoutId);

          // Update state if we were previously offline
          setState((prev) => {
            if (!prev.isOnline) {
              return {
                isOnline: true,
                error: null,
                lastChanged: new Date(),
                isSupported: true,
              };
            }
            return prev;
          });
        } catch (fetchError) {
          clearTimeout(timeoutId);

          // Only update if we were previously online
          setState((prev) => {
            if (prev.isOnline) {
              return {
                isOnline: false,
                error: new NetworkError("Connection check failed", fetchError),
                lastChanged: new Date(),
                isSupported: true,
              };
            }
            return prev;
          });
        }
      } catch (error) {
        // Handle any unexpected errors in the ping check
        console.error(
            new NetworkError("Error during connection check", error)
        );
      }
    };

    // Setup ping interval
    pingIntervalId = window.setInterval(checkConnection, pingInterval);

    return () => {
      if (pingIntervalId !== null) {
        clearInterval(pingIntervalId);
      }
    };
  }, [isSupported]);

  return state;
};

export default useOnline;
