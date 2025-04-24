// Respect user's motion preferences
import { useState, useEffect } from "react";

/**
 * Hook that detects if the user has requested reduced motion
 * @returns True if reduced motion is preferred
 */
const usePrefersReducedMotion = (): boolean => {
  // Default to false (no preference) if query is not supported
  const [prefersReducedMotion, setPrefersReducedMotion] =
    useState<boolean>(false);

  useEffect(() => {
    // Return early if SSR or if the API is not supported
    if (typeof window === "undefined" || !window.matchMedia) {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    // Set initial value
    setPrefersReducedMotion(mediaQuery.matches);

    // Create event listener
    const onChange = (event: MediaQueryListEvent): void => {
      setPrefersReducedMotion(event.matches);
    };

    // Listen for changes
    if ("addEventListener" in mediaQuery) {
      mediaQuery.addEventListener("change", onChange);
    } else {
      // Older browsers
      (mediaQuery as any).addListener(onChange);
    }

    // Clean up
    return () => {
      if ("removeEventListener" in mediaQuery) {
        mediaQuery.removeEventListener("change", onChange);
      } else {
        // Older browsers
        (mediaQuery as any).removeListener(onChange);
      }
    };
  }, []);

  return prefersReducedMotion;
};

export default usePrefersReducedMotion;
