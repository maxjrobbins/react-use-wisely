// Detect user inactivity
import { useState, useEffect, useCallback } from "react";
import { runInBrowser, isFeatureSupported } from "../utils/browser";

/**
 * Result type for the useIdle hook
 */
interface IdleResult {
  isIdle: boolean;
  isSupported: boolean;
  lastActive: number | null;
}

/**
 * Hook that tracks user idle state
 * @param timeout - Idle timeout in ms
 * @param events - DOM events to reset idle timer
 * @returns Object with idle state and support information
 */
const useIdle = (
  timeout: number = 60000,
  events: string[] = [
    "mousedown",
    "mousemove",
    "keypress",
    "scroll",
    "touchstart",
  ]
): IdleResult => {
  // Check if we're in a browser environment that supports DOM events
  const isEventSupported = isFeatureSupported(
    "domEvents",
    () =>
      typeof window !== "undefined" &&
      typeof document !== "undefined" &&
      typeof document.addEventListener === "function"
  );

  // State holding idle information
  const [state, setState] = useState<IdleResult>(() =>
    runInBrowser<IdleResult>(
      () => ({
        isIdle: timeout === 0,
        isSupported: isEventSupported,
        lastActive: isEventSupported ? Date.now() : null,
      }),
      // Default for non-browser environments
      () => ({
        isIdle: false,
        isSupported: false,
        lastActive: null,
      })
    )
  );

  const handleActivity = useCallback(() => {
    const now = Date.now();
    setState((prev) => ({
      ...prev,
      isIdle: false,
      lastActive: now,
    }));

    // Reset timeout
    const timeoutId = setTimeout(() => {
      setState((prev) => ({
        ...prev,
        isIdle: true,
      }));
    }, timeout);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [timeout]);

  useEffect(() => {
    // Early return if not supported or not in browser
    if (!state.isSupported) {
      return;
    }

    // Only set up timer if timeout is not 0
    const cleanup = timeout > 0 ? handleActivity() : () => {};

    // Add event listeners
    events.forEach((event) => {
      document.addEventListener(event, handleActivity);
    });

    // Check for visibility change events to detect when user returns to the tab
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        handleActivity();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Clean up
    return () => {
      cleanup();
      events.forEach((event) => {
        document.removeEventListener(event, handleActivity);
      });
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [events, handleActivity, timeout, state.isSupported]);

  return state;
};

export default useIdle;
