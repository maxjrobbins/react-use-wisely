// Track online status
import { useState, useEffect } from "react";
import { NetworkError } from "./errors";

interface OnlineState {
  isOnline: boolean;
  error: NetworkError | null;
  lastChanged: Date | null;
}

/**
 * Hook that tracks online status
 * @returns An object with online status and error information
 */
const useOnline = (): OnlineState => {
  const [state, setState] = useState<OnlineState>(() => {
    try {
      return {
        isOnline: typeof navigator !== "undefined" ? navigator.onLine : true,
        error: null,
        lastChanged: null,
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
      };
    }
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      // SSR environment - don't try to add listeners
      return;
    }

    try {
      const handleOnline = (): void => {
        setState({
          isOnline: true,
          error: null,
          lastChanged: new Date(),
        });
      };

      const handleOffline = (): void => {
        setState({
          isOnline: false,
          error: null,
          lastChanged: new Date(),
        });
      };

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
      }));
      return () => {};
    }
  }, []);

  return state;
};

export default useOnline;
