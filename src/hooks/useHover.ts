// Track element hover state
import {
  useState,
  useEffect,
  useRef,
  useCallback,
  type RefObject as _RefObject,
} from "react";

/**
 * Hook for tracking hover state on an element
 * @template T The type of HTML element to observe
 * @returns Tuple with element ref and hover state
 */
const useHover = <T extends HTMLElement = HTMLElement>() => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const ref = useRef<T>(null);

  // Create stable callback functions
  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  useEffect(() => {
    const element = ref.current;

    // When element is removed, reset hover state
    if (!element) {
      setIsHovered(false);
      return;
    }

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
  }, [handleMouseEnter, handleMouseLeave]);

  return [ref, isHovered] as const;
};

export default useHover;
