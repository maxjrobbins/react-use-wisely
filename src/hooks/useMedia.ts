import { useState, useEffect } from "react";
import { MediaError } from "./errors";

interface MediaState {
  matches: boolean;
  error: MediaError | null;
}

/**
 * Hook for media queries
 * @param query - The media query string
 * @param defaultState - Default state before matches is detected
 * @returns An object with matches state and error
 */
const useMedia = (query: string, defaultState = false): MediaState => {
  // State for both matches and error
  const [state, setState] = useState<MediaState>(() => {
    if (typeof window === "undefined") {
      return { matches: defaultState, error: null };
    }

    try {
      return {
        matches: window.matchMedia
          ? window.matchMedia(query).matches
          : defaultState,
        error: !window.matchMedia
          ? new MediaError("matchMedia API is not available in this browser")
          : null,
      };
    } catch (error) {
      const mediaError = new MediaError(
        `Error initializing media query "${query}"`,
        error,
        { query }
      );
      console.error(mediaError);
      return { matches: defaultState, error: mediaError };
    }
  });

  useEffect(() => {
    // Return early if window is not available (SSR)
    if (typeof window === "undefined") {
      return undefined;
    }

    // Return early if matchMedia is not available
    if (!window.matchMedia) {
      setState({
        matches: defaultState,
        error: new MediaError(
          "matchMedia API is not available in this browser"
        ),
      });
      return undefined;
    }

    let mounted = true;

    try {
      const mql = window.matchMedia(query);

      const onChange = () => {
        if (!mounted) return;
        setState({ matches: mql.matches, error: null });
      };

      // Listen for changes
      try {
        // Modern browsers
        if ("addEventListener" in mql) {
          mql.addEventListener("change", onChange);
          return () => {
            mounted = false;
            mql.removeEventListener("change", onChange);
          };
        }
        // Older browsers
        else if ("addListener" in mql) {
          // Use any type assertion to handle deprecated API
          (mql as any).addListener(onChange);
          return () => {
            mounted = false;
            (mql as any).removeListener(onChange);
          };
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
  }, [query, defaultState]);

  return state;
};

export default useMedia;
