// Track element dimensions changes
import { useState, useEffect, useRef, MutableRefObject } from "react";
import { ResizeObserverError, ResizeObserverNotSupportedError } from "./errors";

// Define the dimensions object type
interface DimensionsObject {
  width?: number;
  height?: number;
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
  x?: number;
  y?: number;
}

/**
 * Hook that observes an element's dimensions
 * @template T - The type of HTML element to observe
 * @returns [ref, dimensions, error] - Ref to attach, current dimensions, and any error that occurred
 */
const useResizeObserver = <T extends HTMLElement = HTMLElement>(): [
  MutableRefObject<T | null>,
  DimensionsObject,
  ResizeObserverError | null
] => {
  const [dimensions, setDimensions] = useState<DimensionsObject>({
    bottom: 0,
    height: 0,
    left: 0,
    right: 0,
    top: 0,
    width: 0,
    x: 0,
    y: 0
  });
  const [error, setError] = useState<ResizeObserverError | null>(null);
  const ref = useRef<T | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    // Check if ResizeObserver is supported
    if (typeof ResizeObserver === "undefined") {
      const notSupportedError = new ResizeObserverNotSupportedError();
      setError(notSupportedError);
      return;
    }

    let resizeObserver: ResizeObserver;
    const element = ref.current;

    try {
      resizeObserver = new ResizeObserver((entries) => {
        try {
          if (!entries.length) return;

          const { contentRect } = entries[0];
          setDimensions({
            width: contentRect.width,
            height: contentRect.height,
            top: contentRect.top,
            left: contentRect.left,
            right: contentRect.right,
            bottom: contentRect.bottom,
            x: contentRect.x,
            y: contentRect.y,
          });

          // Clear any previous errors on successful observation
          if (error) setError(null);
        } catch (observeError) {
          const resizeError = new ResizeObserverError(
            "Error processing resize entries",
            observeError
          );
          setError(resizeError);
        }
      });

      resizeObserver.observe(element);
    } catch (initError) {
      const resizeError = new ResizeObserverError(
        "Failed to initialize ResizeObserver",
        initError
      );
      setError(resizeError);
      return;
    }

    return () => {
      try {
        resizeObserver.disconnect();
      } catch (disconnectError) {
        // We're in cleanup, so we can't use setState here
        // Just log the error since this is during component unmount
        console.error("Error disconnecting ResizeObserver:", disconnectError);
      }
    };
  }, []); // Empty dependency array is better, ref.current won't trigger re-renders anyway

  return [ref, dimensions, error];
};

export { ResizeObserverError, ResizeObserverNotSupportedError };
export default useResizeObserver;
