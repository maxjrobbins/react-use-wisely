import { useState, useEffect } from "react";
import { features, runInBrowser } from "../utils/browser";

interface PageVisibilityState {
  isVisible: boolean;
  isSupported: boolean;
}

/**
 * Hook to detect when users navigate away from the page
 * @returns An object with the page visibility state and whether the API is supported
 */
function usePageVisibility(): PageVisibilityState {
  // Check if the Page Visibility API is supported
  const isSupported = features.pageVisibility();

  // Get the initial visibility state
  const [visibilityState, setVisibilityState] = useState<PageVisibilityState>(
    () => {
      return runInBrowser(
        () => {
          if (!isSupported) {
            return { isVisible: true, isSupported: false };
          }

          return {
            isVisible: !document.hidden,
            isSupported: true,
          };
        },
        // Default state for non-browser environments
        () => ({ isVisible: true, isSupported: false })
      );
    }
  );

  useEffect(() => {
    // Skip for SSR or if not supported
    if (!isSupported) {
      return;
    }

    // Define the visibility change handler
    const handleVisibilityChange = () => {
      setVisibilityState({
        isVisible: !document.hidden,
        isSupported: true,
      });
    };

    // Add event listener
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Cleanup on unmount
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isSupported]);

  return visibilityState;
}

export default usePageVisibility;
