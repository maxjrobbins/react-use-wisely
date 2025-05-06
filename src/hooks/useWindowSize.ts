// Track browser window dimensions
import { useState, useEffect } from "react";

/**
 * Interface representing window dimensions
 */
interface WindowSize {
  width: number | undefined;
  height: number | undefined;
}

/**
 * Hook result including window size and support information
 */
interface WindowSizeResult {
  width: number | undefined;
  height: number | undefined;
  isSupported: boolean;
  error: Error | null;
}

/**
 * Hook that returns the current window dimensions
 * @returns Standardized hook result with window dimensions
 */
const useWindowSize = (): WindowSizeResult => {
  // Check if window is available (browser environment)
  const isSupported = typeof window !== "undefined";

  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: undefined,
    height: undefined,
  });

  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Skip if not supported (SSR)
    if (!isSupported) return;

    // Handler to call on window resize
    function handleResize(): void {
      try {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to get window size")
        );
      }
    }

    try {
      // Add event listener
      window.addEventListener("resize", handleResize);

      // Call handler right away so state gets updated with initial window size
      handleResize();

      // Remove event listener on cleanup
      return () => window.removeEventListener("resize", handleResize);
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error("Failed to setup window resize listener")
      );
      return undefined;
    }
  }, [isSupported]);

  return {
    ...windowSize,
    isSupported,
    error,
  };
};

export default useWindowSize;
