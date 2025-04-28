import { useState, useEffect, useCallback, useRef } from "react";
import { MediaError } from "./errors";
import { features, runInBrowser } from "../utils/browser";

/**
 * Media query hook options
 */
export interface MediaOptions {
  defaultValue?: boolean;
  onChange?: (matches: boolean) => void;
}

/**
 * Media query hook result
 */
export interface MediaResult {
  // State
  isMatching: boolean;
  // Error handling
  error: MediaError | null;
  // Feature support
  isSupported: boolean;
  // Methods
  refresh: () => void;
}

/**
 * Hook for media queries
 * @param query - The media query string
 * @param options - Configuration options
 * @returns Standardized object with media state, error and support information
 */
const useMedia = (query: string, options: MediaOptions = {}): MediaResult => {
  const { defaultValue = false, onChange } = options;

  // Check if media queries are supported
  const isSupported = features.mediaQueries();

  // Ref to track initialization
  const initialized = useRef(false);

  // Ref to track mounted status
  const mountedRef = useRef(true);

  // State for matches, error, and support status
  const [state, setState] = useState<MediaResult>(() => {
    return runInBrowser<MediaResult>(
      () => {
        if (!isSupported) {
          return {
            isMatching: defaultValue,
            error: new MediaError(
              "matchMedia API is not available in this browser"
            ),
            isSupported: false,
            refresh: () => {},
          };
        }

        try {
          // Only run this if window exists
          if (typeof window !== "undefined" && window.matchMedia) {
            const matches = window.matchMedia(query).matches;
            return {
              isMatching: matches,
              error: null,
              isSupported: true,
              refresh: () => {},
            };
          } else {
            // Fallback if window or matchMedia is not available
            return {
              isMatching: defaultValue,
              error: null,
              isSupported: false,
              refresh: () => {},
            };
          }
        } catch (error) {
          const mediaError = new MediaError(
            `Error initializing media query "${query}"`,
            error,
            { query }
          );
          console.error(mediaError);
          return {
            isMatching: defaultValue,
            error: mediaError,
            isSupported: true, // API is supported but query might be invalid
            refresh: () => {},
          };
        }
      },
      // Default state for non-browser environments
      () => ({
        isMatching: defaultValue,
        error: null,
        isSupported: false,
        refresh: () => {},
      })
    );
  });

  // Safe setState function to prevent updates on unmounted components
  const safeSetState = useCallback(
    (updater: (prev: MediaResult) => MediaResult) => {
      if (mountedRef.current) {
        setState(updater);
      }
    },
    []
  );

  // Function to manually refresh the media query matching state
  const refresh = useCallback(() => {
    if (!isSupported || typeof window === "undefined") return;

    try {
      const mql = window.matchMedia(query);
      safeSetState((prev) => ({
        ...prev,
        isMatching: mql.matches,
        error: null,
      }));
    } catch (error) {
      const mediaError = new MediaError(
        `Error refreshing media query "${query}"`,
        error,
        { query }
      );
      console.error(mediaError);
      safeSetState((prev) => ({
        ...prev,
        error: mediaError,
      }));
    }
  }, [query, isSupported, safeSetState]);

  // Update the refresh method when it changes
  useEffect(() => {
    // Skip first render to avoid potential infinite loops
    if (!initialized.current) {
      initialized.current = true;
      return;
    }

    safeSetState((prev) => ({
      ...prev,
      refresh,
    }));
  }, [refresh, safeSetState]);

  useEffect(() => {
    // Mark as mounted
    mountedRef.current = true;

    // Return early if not supported or window is undefined (SSR)
    if (!isSupported || typeof window === "undefined") {
      return undefined;
    }

    try {
      const mql = window.matchMedia(query);

      const onChangeHandler = () => {
        if (!mountedRef.current) return;

        const matches = mql.matches;

        safeSetState((prev) => ({
          ...prev,
          isMatching: matches,
          error: null,
        }));

        // Call onChange handler if provided
        if (options.onChange) {
          options.onChange(matches);
        }
      };

      // Initial call to set the correct value immediately
      onChangeHandler();

      // Listen for changes
      try {
        // Modern browsers
        if (typeof mql.addEventListener === "function") {
          mql.addEventListener("change", onChangeHandler);
          return () => {
            mountedRef.current = false;
            mql.removeEventListener("change", onChangeHandler);
          };
        }
        // Older browsers
        else if (typeof mql.addListener === "function") {
          // Use addListener for older browsers
          mql.addListener(onChangeHandler);
          return () => {
            mountedRef.current = false;
            mql.removeListener(onChangeHandler);
          };
        } else {
          // If neither method is available, silently proceed without listeners
          // This matches test expectations where no error should be generated
          return () => {
            mountedRef.current = false;
          };
        }
      } catch (listenerError) {
        const mediaError = new MediaError(
          `Failed to add media query listener for "${query}"`,
          listenerError,
          { query }
        );
        console.error(mediaError);
        safeSetState((prev) => ({ ...prev, error: mediaError }));
      }
    } catch (error) {
      const mediaError = new MediaError(
        `Error setting up media query "${query}"`,
        error,
        { query }
      );
      console.error(mediaError);
      safeSetState((prev) => ({ ...prev, error: mediaError }));
    }

    return () => {
      mountedRef.current = false;
    };
  }, [query, isSupported, options.onChange, safeSetState]);

  return state;
};

export default useMedia;
