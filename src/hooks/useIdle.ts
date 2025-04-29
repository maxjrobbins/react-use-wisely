// Detect user inactivity
import { useState, useEffect, useCallback } from "react";
import { DOMError } from "./errors";

interface UseIdleOptions {
  timeout?: number;
  events?: string[];
}

interface UseIdleResult {
  isIdle: boolean;
  isSupported: boolean;
  error: Error | null;
  reset: () => void;
}

/**
 * Hook that tracks user idle state
 * @param options - Configuration options for the idle detection
 * @param options.timeout - Idle timeout in ms (default: 60000)
 * @param options.events - DOM events to reset idle timer
 * @returns Object containing idle state and controls
 */
const useIdle = ({
  timeout = 60000,
  events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart"],
}: UseIdleOptions = {}): UseIdleResult => {
  const [isIdle, setIsIdle] = useState<boolean>(timeout === 0);
  const [error, setError] = useState<Error | null>(null);

  // Feature detection for browser support
  const isSupported =
    typeof window !== "undefined" && typeof document !== "undefined";

  const handleActivity = useCallback(() => {
    try {
      setIsIdle(false);

      // Reset timeout
      const timeoutId = setTimeout(() => {
        setIsIdle(true);
      }, timeout);

      return () => {
        clearTimeout(timeoutId);
      };
    } catch (err) {
      setError(new DOMError("Failed to handle activity", err));
      return () => {};
    }
  }, [timeout]);

  const reset = useCallback(() => {
    try {
      setIsIdle(false);
      handleActivity();
    } catch (err) {
      setError(new DOMError("Failed to reset idle state", err));
    }
  }, [handleActivity]);

  useEffect(() => {
    if (!isSupported) {
      setError(new DOMError("Browser environment not supported"));
      return;
    }

    try {
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
    } catch (err) {
      setError(new DOMError("Failed to set up idle detection", err));
    }
  }, [events, handleActivity, timeout, isSupported]);

  return {
    isIdle,
    isSupported,
    error,
    reset,
  };
};

export default useIdle;
