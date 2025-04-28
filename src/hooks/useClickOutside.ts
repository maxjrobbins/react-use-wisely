// Detect clicks outside of a specified element
import { useEffect, useRef, RefObject } from "react";
import { runInBrowser } from "../utils/browser";
import { DOMError } from "./errors";

/**
 * Options for the useClickOutside hook
 */
export interface ClickOutsideOptions {
  enabled?: boolean;
}

/**
 * Hook result for click outside detection
 */
export interface ClickOutsideResult<T extends HTMLElement = HTMLElement> {
  // State
  ref: RefObject<T>;
  // Error handling
  error: DOMError | null;
  // Support information
  isSupported: boolean;
}

/**
 * Hook that detects clicks outside of a specified element
 * @param callback - Function to call on outside click
 * @param options - Configuration options
 * @returns Standardized object with ref, error state, and support information
 */
const useClickOutside = <T extends HTMLElement = HTMLElement>(
  callback: () => void,
  options: ClickOutsideOptions = {}
): ClickOutsideResult<T> => {
  const { enabled = true } = options;
  const ref = useRef<T>(null);
  const isSupported = typeof document !== "undefined";
  const errorRef = useRef<DOMError | null>(null);

  useEffect(() => {
    // Skip effect if not supported (SSR) or disabled
    if (!isSupported || !enabled) return;

    try {
      const handleClickOutside = (event: MouseEvent): void => {
        if (ref.current && !ref.current.contains(event.target as Node)) {
          callback();
        }
      };

      document.addEventListener("mousedown", handleClickOutside);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    } catch (err) {
      const domError = new DOMError(
        "Error setting up click outside listener",
        err
      );
      errorRef.current = domError;
      console.error(domError);
    }
  }, [callback, isSupported, enabled]);

  return {
    ref,
    error: errorRef.current,
    isSupported,
  } as ClickOutsideResult<T>;
};

export default useClickOutside;
