/**
 * Scroll position information
 */
export interface ScrollPosition {
  x: number;
  y: number;
}

/**
 * Window size information
 */
export interface WindowSize {
  width: number | undefined;
  height: number | undefined;
}

/**
 * Options for intersection observer hooks
 */
export interface IntersectionOptions extends IntersectionObserverInit {
  triggerOnce?: boolean;
  skip?: boolean;
}

/**
 * Options for resize observer hooks
 */
export interface ResizeObserverOptions {
  box?: ResizeObserverBoxOptions;
  skip?: boolean;
}
