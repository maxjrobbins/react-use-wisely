// Detect clicks outside of a specified element
import { useEffect, useRef, RefObject } from "react";

/**
 * Hook that alerts when you click outside of the passed ref
 * @param callback - Function to call on outside click
 * @returns React ref to attach to the element
 */
const useClickOutside = <T extends HTMLElement = HTMLElement>(
  callback: () => void
): RefObject<T | null> => {
  const ref = useRef<T>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [callback]);

  return ref;
};

export default useClickOutside;
