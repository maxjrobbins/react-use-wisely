import { useState, useEffect } from "react";
import { features, runInBrowser } from "../utils/browser";
import { BrowserAPIError } from "../hooks/errors";

interface VisibilityHookResult {
  isVisible: boolean;
  isSupported: boolean;
  error: Error | null;
}

/**
 * Hook to detect when users navigate away from the page using the Page Visibility API
 *
 * @returns {VisibilityHookResult} Object containing:
 *   - isVisible: Whether the page is currently visible to the user
 *   - isSupported: Whether the Page Visibility API is supported in this environment
 *   - error: Any error that occurred during hook execution, or null
 */
function usePageVisibility(): VisibilityHookResult {
  // Check if the Page Visibility API is supported
  const isSupported = features.pageVisibility();

  // Get the initial visibility state
  const [visibilityState, setVisibilityState] = useState<VisibilityHookResult>(
    () => {
      return runInBrowser(
        () => {
          if (!isSupported) {
            return { isVisible: true, isSupported: false, error: null };
          }

          return {
            isVisible: !document.hidden,
            isSupported: true,
            error: null,
          };
        },
        // Default state for non-browser environments
        () => ({ isVisible: true, isSupported: false, error: null })
      );
    }
  );

  useEffect(() => {
    // Skip for SSR or if not supported
    if (!isSupported) {
      return;
    }

    try {
      // Define the visibility change handler
      const handleVisibilityChange = () => {
        setVisibilityState({
          isVisible: !document.hidden,
          isSupported: true,
          error: null,
        });
      };

      // Add event listener
      document.addEventListener("visibilitychange", handleVisibilityChange);

      // Cleanup on unmount
      return () => {
        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange
        );
      };
    } catch (err) {
      setVisibilityState({
        isVisible: visibilityState.isVisible,
        isSupported,
        error: new BrowserAPIError("Error tracking page visibility", err),
      });
    }
  }, [isSupported]);

  return visibilityState;
}

export default usePageVisibility;
