// Detect user inactivity
import { useState, useEffect, useCallback } from "react";

/**
 * Hook that tracks user idle state
 * @param timeout - Idle timeout in ms
 * @param events - DOM events to reset idle timer
 * @returns True if user is idle
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
): boolean => {
  // If timeout is 0, we start in idle state
  const [idle, setIdle] = useState<boolean>(timeout === 0);

  const handleActivity = useCallback(() => {
    setIdle(false);

    // Reset timeout
    const timeoutId = setTimeout(() => {
      setIdle(true);
    }, timeout);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [timeout]);

  useEffect(() => {
    // Only set up timer if timeout is not 0
    const cleanup = timeout > 0 ? handleActivity() : () => {};

    // Add event listeners
    events.forEach((event) => {
      document.addEventListener(event, handleActivity);
    });

    // Clean up
    return () => {
      cleanup();
      events.forEach((event) => {
        document.removeEventListener(event, handleActivity);
      });
    };
  }, [events, handleActivity, timeout]);

  return idle;
};

export default useIdle;
