import { useState, useEffect, RefObject } from "react";
import useThrottle from "./useThrottle";

interface ScrollPosition {
  x: number;
  y: number;
}

interface UseScrollPositionOptions {
  element?: RefObject<HTMLElement>;
  wait?: number;
  skipWhenHidden?: boolean;
}

/**
 * Hook for tracking scroll position
 * @param {UseScrollPositionOptions} options - Configuration options
 * @param {RefObject<HTMLElement>} options.element - Optional element to track (defaults to window)
 * @param {number} options.wait - Throttle delay in ms (defaults to 100)
 * @param {boolean} options.skipWhenHidden - Skip updates when document is hidden (defaults to true)
 * @returns {ScrollPosition} Current scroll position (x, y)
 */
const useScrollPosition = ({
  element,
  wait = 100,
  skipWhenHidden = true,
}: UseScrollPositionOptions = {}): ScrollPosition => {
  const [position, setPosition] = useState<ScrollPosition>({ x: 0, y: 0 });

  // Get the scroll position from either the element or window
  const getScrollPosition = (): ScrollPosition => {
    if (element?.current) {
      return {
        x: element.current.scrollLeft,
        y: element.current.scrollTop,
      };
    }

    if (typeof window === "undefined") {
      return { x: 0, y: 0 };
    }

    return {
      x: window.pageXOffset,
      y: window.pageYOffset,
    };
  };

  // Throttled position update function
  const handleScroll = useThrottle(() => {
    if (skipWhenHidden && document.hidden) {
      return;
    }

    setPosition(getScrollPosition());
  }, wait);

  useEffect(() => {
    // Set initial position
    setPosition(getScrollPosition());

    // Set up scroll listener
    const targetElement = element?.current || window;
    targetElement.addEventListener("scroll", handleScroll);

    return () => {
      targetElement.removeEventListener("scroll", handleScroll);
    };
  }, [element, handleScroll]);

  return position;
};

export default useScrollPosition;
