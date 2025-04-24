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

  useEffect(() => {
    const currentRef = ref.current;
    if (!currentRef) return;

    // Reset error state
    setError(null);

    // Check if IntersectionObserver is supported
    if (!("IntersectionObserver" in window)) {
      const browserError = new IntersectionObserverError(
        "IntersectionObserver is not supported in this browser",
        null,
        { options }
      );
      console.error(browserError);
      setError(browserError);
      return;
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
  }, [options]); // Removed ref.current from dependencies

  return [ref, isIntersecting, error];
};

export default useIntersectionObserver;
