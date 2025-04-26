// Detect when an element is visible in the viewport
import { useState, useEffect, useRef, MutableRefObject } from "react";
import { IntersectionObserverError } from "./errors";

/**
 * Hook that tracks when an element is visible in the viewport
 * @param options - IntersectionObserver options
 * @returns [ref, isIntersecting, error] - Ref to attach, visibility state, and any error
 */
const useIntersectionObserver = <T extends HTMLElement = HTMLElement>(
  options: IntersectionObserverInit = {}
): [MutableRefObject<T | null>, boolean, IntersectionObserverError | null] => {
  const [isIntersecting, setIsIntersecting] = useState<boolean>(false);
  const [error, setError] = useState<IntersectionObserverError | null>(null);
  const ref = useRef<T | null>(null);
  // Use a ref to track if we've already detected browser support issue
  const hasCheckedSupport = useRef<boolean>(false);

  useEffect(() => {
    const currentRef = ref.current;
    if (!currentRef) return;

    // Reset error state only if we haven't already detected a support issue
    if (!hasCheckedSupport.current) {
      setError(null);
    }

    // Check if IntersectionObserver is supported
    if (!("IntersectionObserver" in window)) {
      // If we've already handled this error, just return to prevent loops
      if (hasCheckedSupport.current) {
        return () => {};
      }

      hasCheckedSupport.current = true;
      const browserError = new IntersectionObserverError(
        "IntersectionObserver is not supported in this browser",
        null,
        { options }
      );
      console.error(browserError);

      // Important: Set a fallback value for isIntersecting
      // Default to false to assume the element is not visible when we can't detect
      setIsIntersecting(false);
      setError(browserError);

      // Need to return a cleanup function even when there's no IntersectionObserver
      return () => {};
    }

    let observer: IntersectionObserver;

    try {
      observer = new IntersectionObserver(([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      }, options);

      observer.observe(currentRef);
    } catch (e) {
      const observerError = new IntersectionObserverError(
        "Failed to create or use IntersectionObserver",
        e,
        {
          element: currentRef.tagName,
          options,
        }
      );
      console.error(observerError);

      // Similar to above, set a fallback value for isIntersecting
      setIsIntersecting(false);
      setError(observerError);

      return () => {};
    }

    return () => {
      try {
        if (currentRef) {
          observer.unobserve(currentRef);
        }
      } catch (e) {
        console.error(
          new IntersectionObserverError("Failed to unobserve element", e, {
            element: currentRef.tagName,
          })
        );
      }
    };
  }, [options]);

  return [ref, isIntersecting, error];
};

export default useIntersectionObserver;
