// Track element hover state
import {
  useState,
  useEffect,
  useRef,
  useCallback,
  type RefObject,
} from "react";

// Detect if we're running in a browser environment
const isBrowser = typeof window !== "undefined";

/**
 * Hook for tracking hover state on an element
 * @template T The type of HTML element to observe
 * @returns Object with element ref, hover state, and support status
 */
const useHover = <T extends HTMLElement = HTMLElement>() => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const ref = useRef<T>(null);
  const [error, setError] = useState<Error | null>(null);

  // Check if the feature is supported
  const isSupported = isBrowser;

  // Create stable callback functions
  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  useEffect(() => {
    // Skip if not supported or running in SSR
    if (!isSupported) return;

    const element = ref.current;

    // When element is removed, reset hover state
    if (!element) {
      setIsHovered(false);
      return;
    }

    try {
      // Add event listeners
      element.addEventListener("mouseenter", handleMouseEnter);
      element.addEventListener("mouseleave", handleMouseLeave);

      // Clean up
      return () => {
        element.removeEventListener("mouseenter", handleMouseEnter);
        element.removeEventListener("mouseleave", handleMouseLeave);
        // Reset hover state when element is unmounted
        setIsHovered(false);
      };
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      return undefined;
    }
  }, [handleMouseEnter, handleMouseLeave, isSupported]);

  return {
    ref,
    isHovered,
    isSupported,
    error,
  };
};

export default useHover;
