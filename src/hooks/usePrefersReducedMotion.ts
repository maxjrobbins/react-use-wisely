// Respect user's motion preferences
import { useState, useEffect } from "react";
import { MediaError } from "./errors";
import { features, runInBrowser } from "../utils/browser";

/**
 * Hook that detects if the user has requested reduced motion
 * @returns Object containing whether reduced motion is preferred and support status
 */
const usePrefersReducedMotion = () => {
  const isSupported = features.mediaQueries();
  const [error, setError] = useState<MediaError | null>(null);

  // Default to false (no preference) if query is not supported
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(
    () => {
      return runInBrowser(
        () => {
          if (!isSupported) return false;
          try {
            return window.matchMedia("(prefers-reduced-motion: reduce)")
              .matches;
          } catch (err) {
            const error = new MediaError(
              "Error detecting reduced motion preference",
              err
            );
            setError(error);
            return false;
          }
        },
        () => false
      );
    }
  );

  useEffect(() => {
    // Return early if SSR or if the API is not supported
    if (!isSupported) {
      return;
    }

    try {
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
    } catch (err) {
      const error = new MediaError(
        "Error setting up reduced motion detection",
        err
      );
      setError(error);
    }
  }, [isSupported]);

  return {
    value: prefersReducedMotion,
    isSupported,
    error,
  };
};

export default usePrefersReducedMotion;
