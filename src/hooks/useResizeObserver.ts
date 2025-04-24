// Track element dimensions changes
import { useState, useEffect, useRef, MutableRefObject } from "react";

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
 * @returns [ref, dimensions] - Ref to attach and current dimensions
 */
const useResizeObserver = <T extends HTMLElement = HTMLElement>(): [
  MutableRefObject<T | null>,
  DimensionsObject
] => {
  const [dimensions, setDimensions] = useState<DimensionsObject>({});
  const ref = useRef<T | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    if (typeof ResizeObserver === "undefined") {
      console.warn("ResizeObserver is not supported in this browser");
      return;
    }

    const element = ref.current;
    const resizeObserver = new ResizeObserver((entries) => {
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
    });

    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
    };
  }, []); // Empty dependency array is better, ref.current won't trigger re-renders anyway

  return [ref, dimensions];
};

export default useResizeObserver;
