// Detect when an element is visible in the viewport
import { useState, useEffect, useRef, MutableRefObject } from "react";

/**
 * Hook that tracks when an element is visible in the viewport
 * @param options - IntersectionObserver options
 * @returns [ref, isIntersecting] - Ref to attach and visibility state
 */
const useIntersectionObserver = <T extends HTMLElement = HTMLElement>(
  options: IntersectionObserverInit = {}
): [MutableRefObject<T | null>, boolean] => {
  const [isIntersecting, setIsIntersecting] = useState<boolean>(false);
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const currentRef = ref.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    observer.observe(currentRef);

    return () => {
      observer.unobserve(currentRef);
    };
  }, [options]); // Removed ref.current from dependencies

  return [ref, isIntersecting];
};

export default useIntersectionObserver;
