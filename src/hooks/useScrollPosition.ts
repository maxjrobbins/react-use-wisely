import { useState, useEffect, RefObject, useCallback, useRef } from "react";

interface ScrollPosition {
  x: number;
  y: number;
}

interface UseScrollPositionOptions {
  element?: RefObject<HTMLElement>;
  wait?: number;
  skipWhenHidden?: boolean;
}

interface UseScrollPositionResult {
  x: number;
  y: number;
  isSupported: boolean;
  error: Error | null;
}

/**
 * Hook for tracking scroll position
 * @param {UseScrollPositionOptions} options - Configuration options
 * @param {RefObject<HTMLElement>} options.element - Optional element to track (defaults to window)
 * @param {number} options.wait - Throttle delay in ms (defaults to 100)
 * @param {boolean} options.skipWhenHidden - Skip updates when document is hidden (defaults to true)
 * @returns {UseScrollPositionResult} Current scroll position (x, y) and support information
 */
const useScrollPosition = ({
  element,
  wait = 100,
  skipWhenHidden = true,
}: UseScrollPositionOptions = {}): UseScrollPositionResult => {
  const [position, setPosition] = useState<ScrollPosition>({ x: 0, y: 0 });
  const [error, setError] = useState<Error | null>(null);
  const lastUpdateTimeRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Check if the browser supports the required APIs
  const isSupported =
    typeof window !== "undefined" && typeof document !== "undefined";

  // Get the scroll position from either the element or window
  const getScrollPosition = useCallback((): ScrollPosition => {
    try {
      if (element?.current) {
        return {
          x: element.current.scrollLeft,
          y: element.current.scrollTop,
        };
      }

      if (!isSupported) {
        return { x: 0, y: 0 };
      }

      return {
        x: window.pageXOffset,
        y: window.pageYOffset,
      };
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to get scroll position")
      );
      return { x: 0, y: 0 };
    }
  }, [element, isSupported]);

  // Create a simple throttled scroll handler
  const handleScroll = useCallback(() => {
    try {
      if (skipWhenHidden && document.hidden) {
        return;
      }

      const now = Date.now();
      const elapsedTime = now - lastUpdateTimeRef.current;

      if (elapsedTime < wait) {
        // If we're within the wait period, clear any existing timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        // Schedule an update at the end of the wait period
        timeoutRef.current = setTimeout(() => {
          lastUpdateTimeRef.current = Date.now();
          setPosition(getScrollPosition());
          timeoutRef.current = null;
        }, wait - elapsedTime);

        return;
      }

      // If we've exceeded the wait time, update immediately
      lastUpdateTimeRef.current = now;
      setPosition(getScrollPosition());
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Error handling scroll event")
      );
    }
  }, [getScrollPosition, skipWhenHidden, wait]);

  useEffect(() => {
    if (!isSupported) return;

    try {
      // Set initial position
      setPosition(getScrollPosition());
      lastUpdateTimeRef.current = Date.now();

      // Set up scroll listener
      const targetElement = element?.current || window;

      // @ts-ignore
      targetElement.addEventListener("scroll", handleScroll);

      return () => {
        // Clear any pending timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        // @ts-ignore
        targetElement.removeEventListener("scroll", handleScroll);
      };
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error("Error setting up scroll listener")
      );
    }
  }, [element, getScrollPosition, handleScroll, isSupported]);

  return {
    ...position,
    isSupported,
    error,
  };
};

export default useScrollPosition;
