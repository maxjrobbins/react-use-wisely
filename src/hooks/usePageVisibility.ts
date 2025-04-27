import { useState, useEffect } from "react";

/**
 * Hook to detect when users navigate away from the page
 * @returns {boolean} Whether the page is currently visible
 */
function usePageVisibility(): boolean {
  // Get the initial visibility state
  const [isVisible, setIsVisible] = useState<boolean>(() => {
    // Check for window to avoid SSR issues
    if (typeof window === "undefined" || !document) {
      return true;
    }

    // Use document.hidden or document.visibilityState
    return !document.hidden;
  });

  useEffect(() => {
    // Skip for SSR
    if (typeof window === "undefined" || !document) {
      return;
    }

    // Define the visibility change handler
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    // Add event listener
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Cleanup on unmount
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return isVisible;
}

export default usePageVisibility;
