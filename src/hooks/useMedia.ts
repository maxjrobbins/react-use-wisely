import { useState, useEffect } from "react";

/**
 * Hook for media queries
 * @param query - The media query string
 * @param defaultState - Default state before matches is detected
 * @returns True if the media query matches
 */
const useMedia = (query: string, defaultState = false): boolean => {
  // Initialize with defaultState if matchMedia isn't available
  const [state, setState] = useState<boolean>(() => {
    try {
      return window.matchMedia
        ? window.matchMedia(query).matches
        : defaultState;
    } catch (_e) {
      return defaultState;
    }
  });

  useEffect(() => {
    // Return early if matchMedia is not available
    if (!window.matchMedia) {
      return undefined;
    }

    let mounted = true;
    const mql = window.matchMedia(query);

    const onChange = () => {
      if (!mounted) return;
      setState(mql.matches);
    };

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

    return () => {
      mounted = false;
    };
  }, [query]);

  return state;
};

export default useMedia;
