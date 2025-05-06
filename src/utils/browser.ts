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
  if (!isBrowser) return false;

  if (featureSupport.has(featureName)) {
    return featureSupport.get(featureName)!;
  }

  try {
    const isSupported = detectionFunction();
    featureSupport.set(featureName, isSupported);
    return isSupported;
  } catch (error) {
    console.warn(`Error during feature detection for ${featureName}:`, error);
    featureSupport.set(featureName, false);
    return false;
  }
};

/**
 * Built-in feature detection for common browser APIs
 */
export const features = {
  geolocation: (): boolean =>
    isFeatureSupported(
      "geolocation",
      () => isBrowser && "geolocation" in navigator
    ),

  notifications: (): boolean =>
    isFeatureSupported(
      "notifications",
      () => isBrowser && "Notification" in window
    ),

  speechRecognition: (): boolean =>
    isFeatureSupported(
      "speechRecognition",
      () =>
        isBrowser &&
        ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)
    ),

  clipboard: {
    read: (): boolean =>
      isFeatureSupported(
        "clipboard.read",
        () =>
          isBrowser &&
          "clipboard" in navigator &&
          "readText" in navigator.clipboard
      ),

    write: (): boolean =>
      isFeatureSupported(
        "clipboard.write",
        () =>
          isBrowser &&
          "clipboard" in navigator &&
          "writeText" in navigator.clipboard
      ),
  },

  permissions: (): boolean =>
    isFeatureSupported(
      "permissions",
      () => isBrowser && "permissions" in navigator
    ),

  online: (): boolean =>
    isFeatureSupported("online", () => isBrowser && "onLine" in navigator),

  mediaQueries: (): boolean =>
    isFeatureSupported(
      "mediaQueries",
      () => isBrowser && "matchMedia" in window
    ),

  pageVisibility: (): boolean =>
    isFeatureSupported(
      "pageVisibility",
      () =>
        isBrowser &&
        (document.hidden !== undefined || "visibilityState" in document)
    ),

  intersectionObserver: (): boolean =>
    isFeatureSupported(
      "intersectionObserver",
      () => isBrowser && "IntersectionObserver" in window
    ),

  resizeObserver: (): boolean =>
    isFeatureSupported(
      "resizeObserver",
      () => isBrowser && "ResizeObserver" in window
    ),

  localStorage: (): boolean =>
    isFeatureSupported("localStorage", () => {
      if (!isBrowser) return false;
      try {
        const testKey = "__test_storage__";
        localStorage.setItem(testKey, "test");
        localStorage.removeItem(testKey);
        return true;
      } catch (e) {
        return false;
      }
    }),

  sessionStorage: (): boolean =>
    isFeatureSupported("sessionStorage", () => {
      if (!isBrowser) return false;
      try {
        const testKey = "__test_storage__";
        sessionStorage.setItem(testKey, "test");
        sessionStorage.removeItem(testKey);
        return true;
      } catch (e) {
        return false;
      }
    }),

  mediaDevices: {
    getUserMedia: (): boolean =>
      isFeatureSupported(
        "mediaDevices.getUserMedia",
        () =>
          isBrowser &&
          "mediaDevices" in navigator &&
          "getUserMedia" in navigator.mediaDevices
      ),
  },

  passiveEvents: (): boolean =>
    isFeatureSupported("passiveEvents", () => {
      if (!isBrowser) return false;
      let supportsPassive = false;
      try {
        // Test via a getter in the options object to see if the passive property is accessed
        const opts = Object.defineProperty({}, "passive", {
          get: function () {
            supportsPassive = true;
            return true;
          },
        });
        window.addEventListener("testPassive", null as any, opts);
        window.removeEventListener("testPassive", null as any, opts);
      } catch (e) {}
      return supportsPassive;
    }),
};

/**
 * Safely runs browser-only code with a fallback
 * @param browserFn - Function to run in browser environments
 * @param fallbackFn - Optional fallback for non-browser environments
 * @returns The result of the appropriate function
 */
export function runInBrowser<T>(browserFn: () => T, fallbackFn?: () => T): T {
  if (isBrowser) {
    try {
      return browserFn();
    } catch (error) {
      console.warn("Error running browser code:", error);
      return fallbackFn ? fallbackFn() : (undefined as unknown as T);
    }
  }
  return fallbackFn ? fallbackFn() : (undefined as unknown as T);
}
