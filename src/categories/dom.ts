/**
 * DOM-related hooks
 * @module dom
 */

export { default as useEventListener } from "../hooks/useEventListener";
export { default as useClickOutside } from "../hooks/useClickOutside";
export { default as useHover } from "../hooks/useHover";
export { default as useIntersectionObserver } from "../hooks/useIntersectionObserver";
export { default as useKeyPress } from "../hooks/useKeyPress";
export { default as useResizeObserver } from "../hooks/useResizeObserver";
export { default as useScrollPosition } from "../hooks/useScrollPosition";
export { default as useWindowSize } from "../hooks/useWindowSize";

export type {
  ScrollPosition,
  WindowSize,
  IntersectionOptions,
  ResizeObserverOptions,
} from "../types/dom";
