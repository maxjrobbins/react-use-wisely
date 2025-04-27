/**
 * Safely checks if code is running in a browser environment
 */
export const isBrowser = typeof window !== "undefined";

/**
 * Checks if a specific API is available in the browser
 * @param api - The name of the API to check
 * @returns Whether the API is available
 */
export const isApiSupported = (api: string): boolean => {
  return isBrowser && api in window;
};

/**
 * Creates a function that throttles the execution of a callback
 * @param callback - The function to throttle
 * @param delay - The delay in milliseconds
 * @returns A throttled version of the callback
 */
export const throttle = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let lastCall = 0;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    const now = Date.now();
    const timeElapsed = now - lastCall;

    if (timeElapsed >= delay) {
      lastCall = now;
      callback(...args);
    } else if (!timeoutId) {
      timeoutId = setTimeout(() => {
        lastCall = Date.now();
        timeoutId = null;
        callback(...args);
      }, delay - timeElapsed);
    }
  };
};

/**
 * Creates a function that debounces the execution of a callback
 * @param callback - The function to debounce
 * @param delay - The delay in milliseconds
 * @returns A debounced version of the callback
 */
export const debounce = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      callback(...args);
      timeoutId = null;
    }, delay);
  };
};

/**
 * Storage for memoizing feature detection results
 */
const featureSupport = new Map<string, boolean>();

/**
 * Checks if a browser feature is supported
 * @param featureName - The name of the feature to check
 * @param detectionFunction - Function that detects if the feature is supported
 * @returns Whether the feature is supported
 */
export const isFeatureSupported = (
  featureName: string,
  detectionFunction: () => boolean
): boolean => {
  if (featureSupport.has(featureName)) {
    return featureSupport.get(featureName)!;
  }

  const isSupported = detectionFunction();
  featureSupport.set(featureName, isSupported);
  return isSupported;
};
