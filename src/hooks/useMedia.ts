import { useState, useEffect } from "react";
import { MediaError } from "./errors";
import { features, runInBrowser } from "../utils/browser";

interface MediaState {
  matches: boolean;
  error: MediaError | null;
  isSupported: boolean;
}

/**
 * Hook for media queries
 * @param query - The media query string
 * @param defaultState - Default state before matches is detected
 * @returns An object with matches state, error, and feature support information
 */
const useMedia = (query: string, defaultState = false): MediaState => {
  // Check if media queries are supported
  const isSupported = features.mediaQueries();

  // State for matches, error, and support status
  const [state, setState] = useState<MediaState>(() => {
    return runInBrowser<MediaState>(
      () => {
        if (!isSupported) {
          return {
            matches: defaultState,
            error: new MediaError(
              "matchMedia API is not available in this browser"
            ),
            isSupported: false,
          };
        }

        try {
          return {
            matches: window.matchMedia(query).matches,
            error: null,
            isSupported: true,
          };
        } catch (error) {
          const mediaError = new MediaError(
            `Error initializing media query "${query}"`,
            error,
            { query }
          );
          console.error(mediaError);
          return {
            matches: defaultState,
            error: mediaError,
            isSupported: true, // API is supported but query might be invalid
          };
        }
      },
      // Default state for non-browser environments
      () => ({
        matches: defaultState,
        error: null,
        isSupported: false,
      })
    );
  });

  useEffect(() => {
    // Return early if not supported
    if (!isSupported) {
      return undefined;
    }

    let mounted = true;

    try {
      const mql = window.matchMedia(query);

      const onChange = () => {
        if (!mounted) return;
        setState((prev) => ({
          ...prev,
          matches: mql.matches,
          error: null,
        }));
      };

      // Initial call to set the correct value immediately
      onChange();

      // Listen for changes
      try {
        // Modern browsers
        if (typeof mql.addEventListener === "function") {
          mql.addEventListener("change", onChange);
          return () => {
            mounted = false;
            mql.removeEventListener("change", onChange);
          };
        }
        // Older browsers
        else if (typeof mql.addListener === "function") {
          // Use addListener for older browsers
          mql.addListener(onChange);
          return () => {
            mounted = false;
            mql.removeListener(onChange);
          };
        } else {
          // If neither method is available, log an error
          throw new Error(
            "Neither addEventListener nor addListener is available on MediaQueryList"
          );
        }
      } catch (listenerError) {
        const mediaError = new MediaError(
          `Failed to add media query listener for "${query}"`,
          listenerError,
          { query }
        );
        console.error(mediaError);
        setState((prev) => ({ ...prev, error: mediaError }));
      }
    } catch (error) {
      const mediaError = new MediaError(
        `Error setting up media query "${query}"`,
        error,
        { query }
      );
      console.error(mediaError);
      setState((prev) => ({ ...prev, error: mediaError }));
    }

    return () => {
      mounted = false;
    };
  }, [query, isSupported]);

  return state;
};

export default useMedia;
