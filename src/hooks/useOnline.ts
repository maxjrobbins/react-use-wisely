// Track online status
import { useState, useEffect } from "react";
import { NetworkError } from "./errors";
import { features, runInBrowser } from "../utils/browser";

interface OnlineState {
  isOnline: boolean;
  error: NetworkError | null;
  lastChanged: Date | null;
  isSupported: boolean;
}

/**
 * Hook that tracks online status
 * @returns An object with online status, support status, and error information
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

  useEffect(() => {
    // Don't set up listeners if not in browser or API not supported
    if (!isSupported) {
      return;
    }

    try {
      const handleOnline = (): void => {
        setState({
          isOnline: true,
          error: null,
          lastChanged: new Date(),
          isSupported,
        });
      };

      const handleOffline = (): void => {
        setState({
          isOnline: false,
          error: null,
          lastChanged: new Date(),
          isSupported,
        });
      };

      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);

      // Add fetch listener as additional check (for more accurate status)
      let pingIntervalId: number | null = null;

      // Only set up ping if supported and fetch API is available
      if (typeof window !== "undefined" && "fetch" in window) {
        // Ping a reliable endpoint every 30 seconds to double-check online status
        const pingEndpoint = "https://www.google.com/favicon.ico"; // Typically highly available
        const pingInterval = 30000; // 30 seconds

        const checkConnection = async () => {
          // Skip check if already known to be offline
          if (!navigator.onLine) return;

          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);

            await fetch(pingEndpoint, {
              method: "HEAD",
              mode: "no-cors",
              cache: "no-store",
              signal: controller.signal,
            });

            clearTimeout(timeoutId);

            // If we got here, we're definitely online
            if (!state.isOnline) {
              setState({
                isOnline: true,
                error: null,
                lastChanged: new Date(),
                isSupported,
              });
            }
          } catch (error) {
            // If we can't reach the endpoint, we might be offline
            // But only update if we previously thought we were online
            if (state.isOnline) {
              setState({
                isOnline: false,
                error: new NetworkError("Connection check failed", error),
                lastChanged: new Date(),
                isSupported,
              });
            }
          }
        };

        pingIntervalId = window.setInterval(checkConnection, pingInterval);
      }

      return () => {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
        if (pingIntervalId !== null) {
          clearInterval(pingIntervalId);
        }
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
  }, [isSupported, state.isOnline]);

  return state;
};

export default useOnline;
